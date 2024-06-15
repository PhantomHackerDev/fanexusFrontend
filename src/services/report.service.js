import { post } from '~api';
const root = 'userReport';

export const submitReport = payload => post(root, payload);
