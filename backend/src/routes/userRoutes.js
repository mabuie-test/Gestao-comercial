import { Router } from 'express';
import { listUsers, updateUser, resetPassword } from '../controllers/userController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { userUpdateValidation, passwordResetValidation } from '../validators/userValidators.js';

const router = Router();

router.use(authenticate, authorize('admin'));

router.get('/', listUsers);
router.put('/:id', userUpdateValidation, updateUser);
router.post('/:id/reset-password', passwordResetValidation, resetPassword);

export default router;
