import express from 'express';
import { check } from 'express-validator';

import {
    createMessage,
    deleteMessage
} from '../controllers/messages-controllers';
import { checkAuth } from '../middleware/check-auth';

const router = express.Router();

router.use(checkAuth);

router.post(
    '/create',
    [check(['message', 'partyId']).not().isEmpty()],
    createMessage
);

router.delete('/delete/:messageId', deleteMessage);

export default router;
