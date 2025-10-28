import { body } from 'express-validator';

export const customerValidation = [
  body('name').notEmpty().withMessage('Nome obrigatório'),
  body('email').optional().isEmail().withMessage('Email inválido'),
  body('phone').optional().isString(),
  body('taxId').optional().isString(),
  body('address.street').optional().isString(),
  body('address.city').optional().isString(),
  body('address.province').optional().isString(),
];
