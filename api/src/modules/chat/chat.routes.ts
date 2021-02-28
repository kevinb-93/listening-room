import express from 'express';
import { check } from 'express-validator';

import { createMessage, deleteMessage } from './chat.controller';
import { verifyAccessToken } from '../../shared/middleware/auth';

const router = express.Router();

router.use(verifyAccessToken);

router.post(
    '/create',
    [check(['message', 'partyId']).not().isEmpty()],
    createMessage
);

router.delete('/delete/:messageId', deleteMessage);

export default router;
