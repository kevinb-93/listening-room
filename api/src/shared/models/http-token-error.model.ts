import HttpError from './http-error.model';

class HttpTokenError extends HttpError {
    isTokenError: boolean;
    constructor(message: string, statusCode: number) {
        super(message, statusCode);
        this.isTokenError = true;
    }
}

export const isHttpTokenError = (error: unknown): error is HttpTokenError => {
    return (error as HttpTokenError)?.isTokenError === true;
};

export default HttpTokenError;
