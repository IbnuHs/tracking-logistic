import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://transporter.kallatranslog.co.id/api/v1/',
  headers: {
    'x-api-key': '123',
    'Content-type': 'application/json',
  },
});
