import { Router } from 'express';
import {
  listCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
} from '../controllers/customerController.js';
import { authenticate } from '../middleware/auth.js';
import { customerValidation } from '../validators/customerValidators.js';

const router = Router();

router.use(authenticate);

router.get('/', listCustomers);
router.get('/:id', getCustomer);
router.post('/', customerValidation, createCustomer);
router.put('/:id', customerValidation, updateCustomer);

export default router;
