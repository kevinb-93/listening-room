import express from 'express';
import { check } from 'express-validator';

import { signup, login } from '../controllers/users-controllers';

const router = express.Router();

router.post(
    '/signup',
    [
        check('name').not().isEmpty(),
        check('email').normalizeEmail().isEmail(),
        check('password').isLength({ min: 6 }),
    ],
    signup
);

router.post('/login', login);

export default router;
