import jwt from 'jsonwebtoken';

import secret from '../config/secret';
import { TokenPayload } from '../typings/token';

export enum TokenTypes {
    Access,
    Refresh
}

interface TokenCreateProps extends TokenPayload {
    type: TokenTypes;
}

const getSecretKey = (type: TokenTypes) => {
    switch (type) {
        case TokenTypes.Access:
            return secret.ACCESS_TOKEN_KEY;
        case TokenTypes.Refresh:
            return secret.REFRESH_TOKEN_KEY;
        default:
            return '';
    }
};

const getTokenExpiresIn = (type: TokenTypes) => {
    switch (type) {
        case TokenTypes.Access:
            return '1h';
        case TokenTypes.Refresh:
            return '12h';
        default:
            return '1h';
    }
};

export const createToken = ({ userId, name, type }: TokenCreateProps) => {
    const secretKey = getSecretKey(type);

    const expiresIn = getTokenExpiresIn(type);

    return jwt.sign({ userId, name }, secretKey, {
        expiresIn
    });
};

export const verifyToken = (token: string, type: TokenTypes) => {
    const secretKey = getSecretKey(type);

    return jwt.verify(token, secretKey) as TokenPayload;
};
