import jsonwebtoken from 'jsonwebtoken';
import { UserRole } from '../user.model';
import secret from '../../../shared/config/secret';

export interface Payload {
    userId: string;
    name: string;
    role: UserRole;
}

const expiresIn = '1h';

export class AccessToken {
    private _signedPayload: string;
    static expiresIn: '1h';
    constructor(payload: Payload) {
        this._signedPayload = jsonwebtoken.sign(
            payload,
            secret.ACCESS_TOKEN_KEY,
            {
                expiresIn
            }
        );
    }

    get signedPayload(): string {
        return this._signedPayload;
    }
}
