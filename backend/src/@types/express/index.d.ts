interface User {
    userId: string;
    role: import('../../models/user').UserRole;
}

declare namespace Express {
    interface Request {
        user?: User;
    }
}
