import jwt from 'jsonwebtoken';
import { User } from '@prisma/client';

export function generateAccessToken(user: { id: any; }) {
  return jwt.sign({ userId: user.id }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: '5m',
  });
}


export function generateRefreshToken(user: { id: any; }, jti: any) {
  return jwt.sign({
    userId: user.id,
    jti
  }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '8h',
  });
}


export function generateTokens(user:User, jti: string) {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user, jti);

  return {
    accessToken,
    refreshToken,
  };
}

import crypto from 'crypto';

export function hashToken(token: string) {
  return crypto.createHash('sha512').update(token).digest('hex');
}

export function sendRefreshToken(res: { cookie: (arg0: string, arg1: any, arg2: { httpOnly: boolean; sameSite: boolean; path: string; }) => void; }, token: any) {
  res.cookie('refresh_token', token, {
    httpOnly: true,
    sameSite: true,
    path: '/api/v1/auth',
  });
}