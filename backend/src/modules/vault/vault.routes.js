import express from 'express';
import { getVault, savePassword, deletePassword, updatePassword} from './vault.controller.js';
import authMiddleware from '../auth/auth.middleware.js';

const router = express.Router();

router.post('/', authMiddleware, savePassword);
router.get('/', authMiddleware, getVault);
router.delete('/:id', authMiddleware, deletePassword);
router.put('/:id', authMiddleware, updatePassword);

export default router;