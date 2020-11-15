import express from 'express';
import { check } from 'express-validator';

import { create, join } from '../controllers/parties-controllers';

const router = express.Router();

router.post('/create', [check(['name']).not().isEmpty()], create);

router.post('/join/:pid', [check(['name']).not().isEmpty()], join);

export default router;
