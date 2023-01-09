import express, { Request, Response, NextFunction } from 'express';

import bcrypt from "bcrypt";
import jwt  from "jsonwebtoken";
import {v4} from 'uuid'; 
import {
  UpdatePassword,
  findUserByEmail,
  createUserByEmailAndPassword,
  findUserById
} from '../users/services';

import { generateTokens, hashToken, generateResetToken } from "utils/jwt";


import {
  addRefreshTokenToWhitelist,
  findRefreshTokenById,
  deleteRefreshToken,
  revokeTokens
} from './services';

const router = express.Router()

router.post('/register', async (req:Request, res:Response, next:NextFunction) => {
  try {
    console.log(req.body)
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({error: 'An account with this email address is already in use'});
      return;
    }

    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      res.status(400);
      return;
    }
    
    const user = await createUserByEmailAndPassword(email, password);
    const jti = v4();
    const { accessToken, refreshToken } = generateTokens(user, jti);
    await addRefreshTokenToWhitelist({ jti, refreshToken, userId: user.id });

    res.json({
      accessToken,
      refreshToken
    });
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req:Request, res:Response, next:NextFunction) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const existingUser = await findUserByEmail(email);

    if (!existingUser) {
      res.status(403).json({ error: 'The email or password did not match' });
      return;
    }

    const validPassword = await bcrypt.compare(password, existingUser.password);
    if (!validPassword) {
      res.status(403).json({ error: 'The email or password did not match' });;
      return;
    }

    const jti = v4();
    const { accessToken, refreshToken } = generateTokens(existingUser, jti);
    await addRefreshTokenToWhitelist({ jti, refreshToken, userId: existingUser.id });

    res.json({
      accessToken,
      refreshToken
    });
  } catch (err) {
    next(err);
  }
});

router.get('/resetPassword',async (req:Request, res:Response, next:NextFunction) => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400);
      throw new Error('You must provide an email.');
    }
    const existingUser = await findUserByEmail(email);

    if (!existingUser) {
      res.status(403);
      throw new Error('Invalid login credentials.');
    }
    else{
      const jti = v4(); 
      const resetToken = generateResetToken(existingUser, jti);
      //add mail here and send the token in a mail link... 
      res.status(200).json({
        resetToken,
      });
    }
  } catch (err) {
    next(err);
  }
});

router.get('/validateResetToken',async (req:Request, res:Response, next:NextFunction) => {
  //for frontend you can check if the link has a valid token or not 
  
  try {

    const { resetToken } = req.body;
    if (!resetToken) {
      res.status(400);
      throw new Error('You must provide an reset Token.');
    }
    const payload = jwt.verify(resetToken, process.env.RESET_PASSWORD_KEY);

    if (!payload) {
      res.status(403);
      throw new Error('Invalid Token.');
    }
    else{
      res.status(200).json({
        Error: false,
        msg: "Valid Reset Token"
      });
    }
  } catch (err) {
    next(err);
  }
});

router.get('/updatePassword',async (req:Request, res:Response, next:NextFunction) => {
  try {

    const { password, resetToken } = req.body;
      if (!resetToken) {
        res.status(400);
        throw new Error('You must provide an reset Token.');
      }
      const payload = jwt.verify(resetToken, process.env.RESET_PASSWORD_KEY);

      if (!payload) {
        res.status(403);
        throw new Error('Invalid Token.');
      }
      else{
        //update Password
        const user = await UpdatePassword(password, (<any>payload).userId);
        await revokeTokens((<any>payload).userId);
        res.status(200).json({
          Error: false,
          message: "Password has been reset and all tokens have been revoked."
        });
      }
  } catch (err) {
    next(err);
  }
});



router.post('/refreshToken', async (req:Request, res:Response, next:NextFunction) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(400);
      throw new Error('Missing refresh token.');
    }
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    console.log(payload);
    const savedRefreshToken = await findRefreshTokenById((<any>payload).jti);

    if (!savedRefreshToken || savedRefreshToken.revoked === true) {
      res.status(401);
      throw new Error('Unauthorized');
    }

    const hashedToken = hashToken(refreshToken);
    if (hashedToken !== savedRefreshToken.hashedToken) {
      res.status(401);
      throw new Error('Unauthorized');
    }

    const user = await findUserById((<any>payload).userId);
    if (!user) {
      res.status(401);
      throw new Error('Unauthorized');
    }

    await deleteRefreshToken(savedRefreshToken.id);
    const jti = v4();
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user, jti);
    await addRefreshTokenToWhitelist({ jti, refreshToken: newRefreshToken, userId: user.id });

    res.json({
      accessToken,
      refreshToken: newRefreshToken
    });
  } catch (err) {
    next(err);
  }
});

// This endpoint is only for demo purpose.
// Move this logic where you need to revoke the tokens( for ex, on password reset)
router.post('/revokeRefreshTokens', async (req:Request, res:Response, next:NextFunction) => {
  try {
    const { userId } = req.body;
    await revokeTokens(userId);
    res.json({ message: `Tokens revoked for user with id #${userId}` });
  } catch (err) {
    next(err);
  }
});

export default router;