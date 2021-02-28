import jwt from 'jsonwebtoken';

import secret from '../config/secret';
import { TokenPayload } from '../typings/token';

export enum TokenType {
    Access,
    Refresh
}

interface TokenCreateProps extends TokenPayload {
    type: TokenType;
}

const getSecretKey = (type: TokenType) => {
    switch (type) {
        case TokenType.Access:
            return secret.ACCESS_TOKEN_KEY;
        case TokenType.Refresh:
            return secret.REFRESH_TOKEN_KEY;
        default:
            return '';
    }
};

const getTokenExpiresIn = (type: TokenType) => {
    switch (type) {
        case TokenType.Access:
            return '1h';
        case TokenType.Refresh:
            return '30d';
        default:
            return '1h';
    }
};

export const createToken = ({ userId, name, role, type }: TokenCreateProps) => {
    const secretKey = getSecretKey(type);

    const expiresIn = getTokenExpiresIn(type);

    return jwt.sign({ userId, name, role }, secretKey, {
        expiresIn
    });
};

export const verifyToken = (token: string, type: TokenType) => {
    const secretKey = getSecretKey(type);

    return jwt.verify(token, secretKey) as TokenPayload;
};
