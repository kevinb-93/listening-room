import { CorsOptions } from 'cors';

export const corsOptions: CorsOptions = {
    allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'Authorization'
    ],
    methods: ['OPTIONS', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE']
};
