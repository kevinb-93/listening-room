import express from 'express';
import { check } from 'express-validator';

import {
    login,
    register,
    refreshToken,
    logout,
    currentUser
} from './user.controller';
import { verifyAccessToken } from '../../shared/middleware/auth';

const router = express.Router();

router.post('/login', [check(['name', 'password']).not().isEmpty()], login);

router.post('/register', register);

router.post('/refresh-token', refreshToken);

router.use(verifyAccessToken);

router.delete('/logout', logout);

router.get('/', currentUser);

export default router;
