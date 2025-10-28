import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
    },
    companyTaxId: String,
    companyEmail: String,
    companyPhone: String,
    companyAddress: String,
    invoiceTimbreUrl: String,
    invoiceNotes: String,
    currency: {
      type: String,
      default: 'MZN',
    },
    locale: {
      type: String,
      default: 'pt-MZ',
    },
    invoicePrefix: {
      type: String,
      default: 'FT',
    },
    nextInvoiceNumber: {
      type: Number,
      default: 1,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Setting', settingSchema);
