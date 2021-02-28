import { Request, Response, NextFunction } from 'express';

import HttpError from '../models/http-error.model';

export const errorHandler = (
    err: HttpError,
    _req: Request,
    res: Response,
    next: NextFunction
) => {
    if (res.headersSent) {
        return next(err);
    }
    res.status(err.code || 500);
    res.json({ message: err.message || 'An unknown error occurred!' });
};
