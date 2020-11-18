interface UserData {
    userId: string;
}

declare namespace Express {
    interface Request {
        userData?: UserData;
    }
}
