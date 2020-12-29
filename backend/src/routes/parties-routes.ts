import express from 'express';
import { check } from 'express-validator';
import { checkAuth } from '../middleware/check-auth';

import {
    create,
    join,
    party,
    messages
} from '../controllers/parties-controllers';

const router = express.Router();

router.post('/create', [check(['name']).not().isEmpty()], create);

router.post('/join/:pid', [check(['name']).not().isEmpty()], join);

router.use(checkAuth);

router.get('/:pid', party);

router.get('/:pid/messages', messages);

export default router;
