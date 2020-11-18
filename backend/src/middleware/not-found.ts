import HttpError from '../models/http-error';

export const notFound = () => {
    const error = new HttpError('Could not find this route.', 404);
    throw error;
};
