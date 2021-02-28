import HttpError from '../models/http-error.model';

export const notFound = () => {
    throw new HttpError('Could not find this route.', 404);
};
