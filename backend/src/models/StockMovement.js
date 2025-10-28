import mongoose from 'mongoose';

const stockMovementSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ['entrada', 'saida', 'ajuste'],
      required: true,
    },
    reference: String,
    notes: String,
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('StockMovement', stockMovementSchema);
