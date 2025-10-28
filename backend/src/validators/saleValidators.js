import { body } from 'express-validator';

export const saleValidation = [
  body('customer').notEmpty().withMessage('Cliente obrigatório'),
  body('items').isArray({ min: 1 }).withMessage('É necessário adicionar pelo menos um item'),
  body('items.*.product').notEmpty().withMessage('Produto obrigatório'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantidade inválida'),
  body('items.*.unitPrice').optional().isFloat({ min: 0 }),
  body('payment.method').optional().isIn(['dinheiro', 'transferencia', 'mpesa', 'cartao', 'outro']),
  body('payment.status').optional().isIn(['pendente', 'pago', 'parcial', 'cancelado']),
];
