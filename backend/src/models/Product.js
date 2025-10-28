import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    barcode: String,
    description: String,
    category: String,
    costPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    salePrice: {
      type: Number,
      required: true,
      min: 0,
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    reorderLevel: {
      type: Number,
      default: 5,
    },
    unit: {
      type: String,
      default: 'UN',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    metadata: {
      iva: {
        type: Number,
        default: 0,
      },
      customizable: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    timestamps: true,
  }
);

productSchema.index({ name: 'text', description: 'text', sku: 'text', category: 'text' });

export default mongoose.model('Product', productSchema);
