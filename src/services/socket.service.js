import socketClient from 'socket.io-client';
import { API_URL } from '@/services/config';

export default socketClient(API_URL, { transports: ['websocket'] });
