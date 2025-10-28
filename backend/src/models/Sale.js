import mongoose from 'mongoose';

const saleItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    description: String,
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    unitPrice: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    taxRate: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const paymentSchema = new mongoose.Schema(
  {
    method: {
      type: String,
      enum: ['dinheiro', 'transferencia', 'mpesa', 'cartao', 'outro'],
      default: 'dinheiro',
    },
    status: {
      type: String,
      enum: ['pendente', 'pago', 'parcial', 'cancelado'],
      default: 'pendente',
    },
    paidAmount: {
      type: Number,
      default: 0,
    },
    dueDate: Date,
    notes: String,
  },
  { _id: false }
);

const saleSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
    },
    issuedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [saleItemSchema],
    subtotal: {
      type: Number,
      required: true,
    },
    taxTotal: {
      type: Number,
      default: 0,
    },
    discountTotal: {
      type: Number,
      default: 0,
    },
    grandTotal: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['aberta', 'emitida', 'cancelada'],
      default: 'emitida',
    },
    payment: paymentSchema,
    notes: String,
    metadata: {
      currency: {
        type: String,
        default: 'MZN',
      },
      exchangeRate: Number,
      timbreUrl: String,
      companyName: String,
      companyTaxId: String,
      companyEmail: String,
      companyPhone: String,
      companyAddress: String,
    },
    cancelledAt: Date,
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

saleSchema.index({ invoiceNumber: 1 });
saleSchema.index({ createdAt: -1 });

export default mongoose.model('Sale', saleSchema);
