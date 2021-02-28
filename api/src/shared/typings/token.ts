import { UserRole } from '../../modules/user/user.model';

export interface TokenPayload {
    userId: string;
    name: string;
    role: UserRole;
}
