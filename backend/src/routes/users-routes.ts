import express from 'express';
import { check } from 'express-validator';

import {
    refreshToken,
    logout,
    currentUser
} from '../controllers/users-controllers';
import { checkAuth } from '../middleware/check-auth';

const router = express.Router();

router.post(
    '/refresh-token',
    [check(['refreshToken']).not().isEmpty()],
    refreshToken
);

router.delete('/logout', [check(['refreshToken']).not().isEmpty()], logout);

router.use(checkAuth);

router.get('/', currentUser);

export default router;
