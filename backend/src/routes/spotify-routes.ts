import express from 'express';

import {
    login,
    callback,
    refreshToken,
} from '../controllers/spotify-controllers';

const router = express.Router();

router.get('/login', login);

router.get('/callback', callback);

router.get('/refresh_token', refreshToken);

export default router;
