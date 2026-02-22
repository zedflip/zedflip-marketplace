import jwt from 'jsonwebtoken';
import { IUser } from '../models/User';

interface TokenPayload {
  id: string;
  email: string;
  isAdmin: boolean;
}

export const generateToken = (user: IUser): string => {
  const payload: TokenPayload = {
    id: user._id.toString(),
    email: user.email,
    isAdmin: user.isAdmin,
  };

  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
};

export const generateRefreshToken = (user: IUser): string => {
  return jwt.sign(
    { id: user._id.toString() },
    process.env.JWT_SECRET!,
    { expiresIn: '30d' }
  );
};

export default { generateToken, verifyToken, generateRefreshToken };
