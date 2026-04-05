export const ENV_MODE = process.env.NODE_ENV;
export const isDevMode = ENV_MODE === 'development';
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;