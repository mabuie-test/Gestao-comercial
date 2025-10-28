import { body } from 'express-validator';

export const userUpdateValidation = [
  body('name').optional().isString(),
  body('role').optional().isIn(['admin', 'vendedor']).withMessage('Perfil inválido'),
  body('active').optional().isBoolean(),
];

export const passwordResetValidation = [
  body('password').isLength({ min: 6 }).withMessage('A senha deve ter pelo menos 6 caracteres'),
];
