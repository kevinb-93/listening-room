import express from 'express';

import { login, callback, refreshToken } from './spotify.controller';

const router = express.Router();

router.get('/login', login);

router.get('/callback', callback);

router.get('/refresh_token', refreshToken);

export default router;
