import { Router } from 'express';
import { login, register, registerAdmin } from '../controllers/authController.js';
import {
  loginValidation,
  registerValidation,
  registerAdminValidation,
} from '../validators/authValidators.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.post('/login', loginValidation, login);
router.post('/register', authenticate, authorize('admin'), registerValidation, register);
router.post('/register/admin', registerAdminValidation, registerAdmin);

export default router;
