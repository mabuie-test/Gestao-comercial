import { Router } from 'express';
import { login, register } from '../controllers/authController.js';
import { loginValidation, registerValidation } from '../validators/authValidators.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.post('/login', loginValidation, login);
router.post('/register', authenticate, authorize('admin'), registerValidation, register);

export default router;
