interface User {
    userId: string;
    role: import('../../modules/user/user.model').UserRole;
}

declare namespace Express {
    interface Request {
        user?: User;
    }
}
