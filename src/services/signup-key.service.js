import { get, post } from '~api';
import { WEBSITE_URL } from '@/services/config';
const root = 'signup-key';

export const getSignupKeys = () => get(`${root}`);
export const createSignupKey = payload => post(`${root}`, payload);

export const emailTemplate = key => `Greetings from Fanexus!

Congratulations, your account has been approved for our beta! Please follow the link below to proceed to the website:

${WEBSITE_URL}/?key=${key}

This activation link is single-use and only meant for you. Don't share it with others!

If you run into any bugs, you can report them on our Discord beta server or over [here].

Welcome to Fanexus, we hope you have an amazing time!`;
