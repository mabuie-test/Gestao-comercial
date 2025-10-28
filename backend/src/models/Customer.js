import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    taxId: {
      type: String,
      trim: true,
    },
    address: {
      street: String,
      city: String,
      province: String,
      country: {
        type: String,
        default: 'Moçambique',
      },
    },
    notes: String,
    category: {
      type: String,
      enum: ['retalho', 'grossista', 'corporativo'],
      default: 'retalho',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Customer', customerSchema);
