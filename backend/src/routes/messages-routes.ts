import express from 'express';
import { check } from 'express-validator';

import {
    createMessage,
    deleteMessage
} from '../controllers/messages-controllers';
import { verifyAccessToken } from '../middleware/auth';

const router = express.Router();

router.use(verifyAccessToken);

router.post(
    '/create',
    [check(['message', 'partyId']).not().isEmpty()],
    createMessage
);

router.delete('/delete/:messageId', deleteMessage);

export default router;
