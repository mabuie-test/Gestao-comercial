import { Router } from 'express';
import {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  adjustStock,
  listMovements,
} from '../controllers/productController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import {
  productCreateValidation,
  productUpdateValidation,
  adjustStockValidation,
} from '../validators/productValidators.js';

const router = Router();

router.use(authenticate);

router.get('/', listProducts);
router.get('/:id', getProduct);
router.post('/', authorize('admin'), productCreateValidation, createProduct);
router.put('/:id', authorize('admin'), productUpdateValidation, updateProduct);
router.post('/:id/ajustar-stock', authorize('admin'), adjustStockValidation, adjustStock);
router.get('/:id/movimentos', authorize('admin'), listMovements);

export default router;
