import axios from 'axios';

import { baseUrl } from './server';

export default axios.create({
    baseURL: `${baseUrl}/api`,
    headers: {
        'Content-Type': 'application/json'
    },
    responseType: 'json'
});
