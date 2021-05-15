import { Request, Response, NextFunction } from 'express';
import HttpAuthError, {
    isHttpTokenError
} from '../models/http-token-error.model';

import HttpError from '../models/http-error.model';

type Error = HttpError | HttpAuthError;

export enum ErrorCode {
    httpError,
    tokenError
}

const getErrorCode = (err: Error) => {
    return isHttpTokenError(err) ? ErrorCode.tokenError : ErrorCode.httpError;
};

export const errorHandler = (
    err: Error,
    _req: Request,
    res: Response,
    next: NextFunction
) => {
    if (res.headersSent) {
        return next(err);
    }

    res.status(err.status || 500);
    res.json({
        message: err.message ?? 'An unknown error occurred!',
        code: getErrorCode(err)
    });
};
