import { validationResult } from 'express-validator';
import Product from '../models/Product.js';
import StockMovement from '../models/StockMovement.js';

export const listProducts = async (req, res) => {
  const { search, status } = req.query;
  const filter = {};
  if (status === 'active') filter.isActive = true;
  if (status === 'inactive') filter.isActive = false;

  if (search) {
    filter.$text = { $search: search };
  }

  const products = await Product.find(filter).sort({ createdAt: -1 });
  return res.json(products);
};

export const getProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Produto não encontrado' });
  }
  return res.json(product);
};

export const createProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const product = await Product.create({
    ...req.body,
  });

  if (product.stock > 0) {
    await StockMovement.create({
      product: product.id,
      quantity: product.stock,
      type: 'entrada',
      reference: 'Stock inicial',
      performedBy: req.user.id,
    });
  }

  return res.status(201).json(product);
};

export const updateProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    return res.status(404).json({ message: 'Produto não encontrado' });
  }

  return res.json(product);
};

export const adjustStock = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { quantity, type, notes } = req.body;
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: 'Produto não encontrado' });
  }

  if (type === 'saida' && product.stock < quantity) {
    return res.status(400).json({ message: 'Stock insuficiente para saída' });
  }

  const newStock =
    type === 'entrada' ? product.stock + quantity : product.stock - quantity;

  product.stock = newStock;
  await product.save();

  const movement = await StockMovement.create({
    product: product.id,
    quantity,
    type,
    notes,
    performedBy: req.user.id,
  });

  return res.json({ product, movement });
};

export const listMovements = async (req, res) => {
  const movements = await StockMovement.find({ product: req.params.id })
    .populate('performedBy', 'name email')
    .sort({ createdAt: -1 });

  return res.json(movements);
};
