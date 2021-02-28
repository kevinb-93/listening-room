import { UserRole } from '../models/user';

export interface TokenPayload {
    userId: string;
    name: string;
    role: UserRole;
}
