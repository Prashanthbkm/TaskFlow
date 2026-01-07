export const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-change-in-production';
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key';
export const TOKEN_EXPIRY = '15m';
export const REFRESH_TOKEN_EXPIRY = '7d';