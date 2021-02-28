import express from 'express';
import { check } from 'express-validator';
import { verifyAccessToken } from '../../shared/middleware/auth';
import {
    create,
    party,
    messages,
    nowPlaying,
    updateQueue,
    getQueue,
    getPlayer,
    addTrackQueue,
    deleteTrackQueue,
    getParties,
    join
} from './party.controller';

const router = express.Router();

router.get('', getParties);

router.use(verifyAccessToken);

router.post('/join', join);

router.post('/create', create);

router.get('/:pid', party);

router.get('/:pid/messages', messages);

router.put('/now-playing/:pid', nowPlaying);

router.put('/queue/:pid', updateQueue);

router.post('/queue/:pid', addTrackQueue);

router.delete('/queue/:pid', deleteTrackQueue);

router.get('/queue/:pid', getQueue);

router.get('/:pid/player', getPlayer);

export default router;
