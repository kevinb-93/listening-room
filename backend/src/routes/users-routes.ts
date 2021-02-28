import express from 'express';
import { check } from 'express-validator';

import {
    login,
    register,
    refreshToken,
    logout,
    currentUser
} from '../controllers/users-controllers';
import { verifyAccessToken } from '../middleware/auth';

const router = express.Router();

router.post('/login', [check(['name', 'password']).not().isEmpty()], login);

router.post('/register', register);

router.post(
    '/refresh-token',
    [check(['refreshToken']).not().isEmpty()],
    refreshToken
);

router.use(verifyAccessToken);

router.delete('/logout', logout);

router.get('/', currentUser);

export default router;
