import { Router } from 'express';
import {
  createSale,
  listSales,
  getSale,
  cancelSale,
  downloadInvoice,
  getDashboardMetrics,
  getSettings,
  updateSettings,
} from '../controllers/saleController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { saleValidation } from '../validators/saleValidators.js';
import { settingValidation } from '../validators/settingValidators.js';

const router = Router();

router.use(authenticate);

router.get('/dashboard', getDashboardMetrics);
router.get('/settings', authorize('admin'), getSettings);
router.put('/settings', authorize('admin'), settingValidation, updateSettings);
router.get('/:id/invoice', downloadInvoice);
router.post('/', saleValidation, createSale);
router.get('/', listSales);
router.get('/:id', getSale);
router.post('/:id/cancelar', authorize('admin'), cancelSale);

export default router;
