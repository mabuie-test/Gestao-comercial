import { validationResult } from 'express-validator';
import mongoose from 'mongoose';
import Sale from '../models/Sale.js';
import Product from '../models/Product.js';
import Customer from '../models/Customer.js';
import StockMovement from '../models/StockMovement.js';
import { generateInvoicePdf } from '../utils/invoice.js';
import { generateInvoiceNumber, getOrCreateDefaultSetting } from '../services/invoiceService.js';

const calculateTotals = (items) => {
  const subtotal = items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const discountTotal = items.reduce((acc, item) => acc + (item.discount || 0), 0);
  const taxTotal = items.reduce((acc, item) => acc + ((item.taxRate || 0) / 100) * item.unitPrice * item.quantity, 0);
  const grandTotal = subtotal + taxTotal - discountTotal;
  return {
    subtotal,
    discountTotal,
    taxTotal,
    grandTotal,
  };
};

export const createSale = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { customer: customerId, items, payment, notes } = req.body;

    const customer = await Customer.findById(customerId).session(session);
    if (!customer) {
      throw new Error('Cliente inválido');
    }

    const productIds = items.map((item) => item.product);
    const products = await Product.find({ _id: { $in: productIds } }).session(session);

    const productsMap = products.reduce((acc, product) => {
      acc[product.id] = product;
      return acc;
    }, {});

    const enrichedItems = items.map((item) => {
      const product = productsMap[item.product];
      if (!product) {
        throw new Error('Produto inválido');
      }

      if (product.stock < item.quantity) {
        throw new Error(`Stock insuficiente para o produto ${product.name}`);
      }

      return {
        product: product.id,
        description: product.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice ?? product.salePrice,
        discount: item.discount || 0,
        taxRate: item.taxRate ?? product.metadata?.iva ?? 0,
        total:
          (item.unitPrice ?? product.salePrice) * item.quantity - (item.discount || 0) +
          (((item.taxRate ?? product.metadata?.iva ?? 0) / 100) *
            (item.unitPrice ?? product.salePrice) *
            item.quantity),
      };
    });

    const totals = calculateTotals(enrichedItems);
    const { invoiceNumber, setting } = await generateInvoiceNumber(req.user.id);

    const sale = await Sale.create([
      {
        invoiceNumber,
        customer: customer.id,
        issuedBy: req.user.id,
        items: enrichedItems,
        ...totals,
        payment: {
          ...payment,
          status: payment?.status || 'pendente',
        },
        notes,
        metadata: {
          currency: setting.currency,
          companyName: setting.companyName,
          companyTaxId: setting.companyTaxId,
          companyEmail: setting.companyEmail,
          companyPhone: setting.companyPhone,
          companyAddress: setting.companyAddress,
          timbreUrl: setting.invoiceTimbreUrl,
          invoiceNotes: setting.invoiceNotes,
        },
      },
    ], {
      session,
    });

    await Promise.all(
      enrichedItems.map(async (item) => {
        const product = productsMap[item.product];
        product.stock -= item.quantity;
        await product.save({ session });
        await StockMovement.create(
          [
            {
              product: product.id,
              quantity: item.quantity,
              type: 'saida',
              reference: `Factura ${invoiceNumber}`,
              performedBy: req.user.id,
            },
          ],
          { session }
        );
      })
    );

    await session.commitTransaction();

    const createdSale = await Sale.findById(sale[0].id)
      .populate('customer')
      .populate('issuedBy', 'name email');

    return res.status(201).json(createdSale);
  } catch (error) {
    await session.abortTransaction();
    return res.status(400).json({ message: error.message });
  } finally {
    session.endSession();
  }
};

export const listSales = async (req, res) => {
  const { status, from, to, customer } = req.query;
  const filter = {};

  if (status) filter.status = status;
  if (customer) filter.customer = customer;

  if (from || to) {
    filter.createdAt = {};
    if (from) filter.createdAt.$gte = new Date(from);
    if (to) filter.createdAt.$lte = new Date(to);
  }

  const sales = await Sale.find(filter)
    .sort({ createdAt: -1 })
    .populate('customer')
    .populate('issuedBy', 'name email');

  return res.json(sales);
};

export const getSale = async (req, res) => {
  const sale = await Sale.findById(req.params.id)
    .populate('customer')
    .populate('issuedBy', 'name email');

  if (!sale) {
    return res.status(404).json({ message: 'Venda não encontrada' });
  }

  return res.json(sale);
};

export const cancelSale = async (req, res) => {
  const sale = await Sale.findById(req.params.id);
  if (!sale) {
    return res.status(404).json({ message: 'Venda não encontrada' });
  }

  if (sale.status === 'cancelada') {
    return res.status(400).json({ message: 'Venda já se encontra cancelada' });
  }

  sale.status = 'cancelada';
  sale.cancelledAt = new Date();
  sale.cancelledBy = req.user.id;
  sale.payment.status = 'cancelado';

  await sale.save();

  await Promise.all(
    sale.items.map(async (item) => {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
      await StockMovement.create({
        product: item.product,
        quantity: item.quantity,
        type: 'entrada',
        reference: `Cancelamento ${sale.invoiceNumber}`,
        performedBy: req.user.id,
      });
    })
  );

  return res.json({ message: 'Venda cancelada e stock ajustado' });
};

export const downloadInvoice = async (req, res) => {
  const sale = await Sale.findById(req.params.id).populate('customer');
  if (!sale) {
    return res.status(404).json({ message: 'Factura não encontrada' });
  }

  return generateInvoicePdf({ sale, response: res });
};

export const getDashboardMetrics = async (req, res) => {
  const [salesCount, totalRevenue, pendingPayments, lowStock] = await Promise.all([
    Sale.countDocuments({ status: { $ne: 'cancelada' } }),
    Sale.aggregate([
      { $match: { status: { $ne: 'cancelada' } } },
      { $group: { _id: null, total: { $sum: '$grandTotal' } } },
    ]),
    Sale.countDocuments({ 'payment.status': { $in: ['pendente', 'parcial'] } }),
    Product.countDocuments({ stock: { $lte: 5 }, isActive: true }),
  ]);

  const latestSales = await Sale.find({ status: { $ne: 'cancelada' } })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('customer', 'name')
    .populate('issuedBy', 'name');

  return res.json({
    salesCount,
    totalRevenue: totalRevenue[0]?.total || 0,
    pendingPayments,
    lowStock,
    latestSales,
  });
};

export const getSettings = async (req, res) => {
  const setting = await getOrCreateDefaultSetting(req.user.id);
  return res.json(setting);
};

export const updateSettings = async (req, res) => {
  const setting = await getOrCreateDefaultSetting(req.user.id);
  Object.assign(setting, req.body, { updatedBy: req.user.id });
  await setting.save();
  return res.json(setting);
};
