import jwt from 'jsonwebtoken';
import { 
  JWT_SECRET, 
  JWT_REFRESH_SECRET, 
  TOKEN_EXPIRY, 
  REFRESH_TOKEN_EXPIRY 
} from '../config/constants.js';

export const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
};

export const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, JWT_REFRESH_SECRET, { 
    expiresIn: REFRESH_TOKEN_EXPIRY 
  });
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, JWT_REFRESH_SECRET);
};