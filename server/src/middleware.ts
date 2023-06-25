import jwt from 'jsonwebtoken';
import{ Request, Response, NextFunction } from 'express';

const prod = {
  URL: "https://www.roomfin.com",
  clientURL: "https://www.roomfin.com",
};

const dev = {
 URL: "http://localhost:8080",
 clientURL: "http://localhost:19006"
};

const webFrontEnd = {
  URL: "http://localhost:3000",
}
const frontendDev = {
  URL: "http://localhost:19006"
}

export const env = process.env.NODE_ENV === "development" ? dev : prod;
export const frontendEnv = process.env.NODE_ENV === "development" ? frontendDev : prod;
export const webfrontendEnv = process.env.NODE_ENV === "development" ? webFrontEnd : prod;

export function notFound(req:Request, res:Response, next:NextFunction) {
  res.status(404);
  const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
  next(error);
}

/* eslint-disable no-unused-vars */
export function errorHandler(err: { message: any; stack: any; }, req:Request, res:Response, next:NextFunction) {
  /* eslint-enable no-unused-vars */
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
  });
}

export function isAuthenticated(req:Request, res:Response, next:NextFunction) {
  const { authorization } = req.headers;

  if (!authorization) {
    res.status(401).json({ Error: 'Un-Authorized' });
    throw new Error('🚫 Un-Authorized 🚫');
  }

  try {
    const token = authorization.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.body[0] = payload;
  } catch (err) {
    res.status(401).json({ Error: 'Un-Authorized' });;
    if (err.name === 'TokenExpiredError') {
      throw new Error(err.name);
    }
    throw new Error('🚫 Un-Authorized 🚫');
  }

  return next();
}
