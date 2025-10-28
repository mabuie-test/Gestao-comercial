import { body } from 'express-validator';

export const settingValidation = [
  body('companyName').optional().isString(),
  body('companyTaxId').optional().isString(),
  body('companyEmail').optional().isEmail(),
  body('companyPhone').optional().isString(),
  body('companyAddress').optional().isString(),
  body('invoicePrefix').optional().isString(),
  body('invoiceTimbreUrl').optional().isURL().withMessage('URL inválida para timbre'),
  body('currency').optional().isString(),
  body('locale').optional().isString(),
  body('invoiceNotes').optional().isString(),
];
