import crypto from 'crypto';
import { Response, CookieOptions } from 'express';
import { RefreshTokenDocument } from './token.refresh.model';

// expires in 30 days
const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
export const REFRESH_TOKEN_COOKIE_OPTIONS: CookieOptions = {
    httpOnly: true,
    expires,
    path: '/api/user/refresh-token'
};

export interface SignedPayload {
    user: RefreshTokenDocument['user'];
    token: RefreshTokenDocument['token'];
    expires: RefreshTokenDocument['expires'];
    createdByIp: RefreshTokenDocument['createdByIp'];
}

export class RefreshToken {
    private _signedPayload: SignedPayload;

    constructor(userId: RefreshTokenDocument['user'], ipAddress: string) {
        this._signedPayload = {
            user: userId,
            token: RefreshToken.generateRandomString(),
            expires,
            createdByIp: ipAddress
        };
    }

    static setCookie(res: Response, token: string) {
        res.cookie('refreshToken', token, REFRESH_TOKEN_COOKIE_OPTIONS);
    }

    static generateRandomString() {
        return crypto.randomBytes(40).toString('hex');
    }

    get signedPayload(): SignedPayload {
        return this._signedPayload;
    }
}
