import jwt from 'jsonwebtoken';

export function generateAccessToken(user) {
  return jwt.sign({ userId: user.id }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: '5m',
  });
}


export function generateRefreshToken(user, jti) {
  return jwt.sign({
    userId: user.id,
    jti
  }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '8h',
  });
}


export function generateTokens(user, jti) {
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

export function sendRefreshToken(res, token) {
  res.cookie('refresh_token', token, {
    httpOnly: true,
    sameSite: true,
    path: '/api/v1/auth',
  });
}