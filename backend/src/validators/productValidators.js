import { body } from 'express-validator';

export const productCreateValidation = [
  body('name').notEmpty().withMessage('Nome obrigatório'),
  body('sku').notEmpty().withMessage('SKU obrigatório'),
  body('costPrice').isFloat({ min: 0 }).withMessage('Preço de custo inválido'),
  body('salePrice').isFloat({ min: 0 }).withMessage('Preço de venda inválido'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Stock deve ser positivo'),
];

export const productUpdateValidation = [
  body('name').optional().notEmpty(),
  body('costPrice').optional().isFloat({ min: 0 }),
  body('salePrice').optional().isFloat({ min: 0 }),
  body('stock').optional().isInt({ min: 0 }),
];

export const adjustStockValidation = [
  body('quantity').isInt({ min: 1 }).withMessage('Quantidade inválida'),
  body('type').isIn(['entrada', 'saida', 'ajuste']).withMessage('Tipo inválido'),
  body('notes').optional().isString(),
];
