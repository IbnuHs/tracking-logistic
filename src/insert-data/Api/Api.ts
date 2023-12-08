import axios from 'axios';
import * as https from 'https';

export const api = axios.create({
  baseURL: process.env.BASE_URL,
  httpsAgent: new https.Agent({ rejectUnauthorized: false }),
  headers: {
    'x-api-key': '123',
  },
});
