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

import { generateTokens, hashToken, generateResetToken,generateAccessToken } from "utils/jwt";


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
      return res.status(422).json({"Error": "You must provide an email and a password."});
    }

    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return res.status(400).json({"Error": "User with email already exists."});
    }
    
    const user = await createUserByEmailAndPassword(email, password);
    const userId = user.id;
    const jti = v4();
    const { accessToken, refreshToken } = generateTokens(user, jti);
    await addRefreshTokenToWhitelist({ jti, refreshToken, userId: user.id });

    return res.status(200).json({
      accessToken,
      refreshToken,
      userId
    });
  } catch (err) {
    return res.status(500).json({"Error": "Something went wrong."});
  }
});

router.post('/login', async (req:Request, res:Response, next:NextFunction) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(422).json({"Error": "You must provide an email and a password."});
    }

    const existingUser = await findUserByEmail(email);
    
    if (!existingUser) {
      return res.status(401).json({"Error": "Invalid login credentials."});
    }
    const userId = existingUser.id;

    const validPassword = await bcrypt.compare(password, existingUser.password);
    if (!validPassword) {
      return res.status(401).json({"Error": "Invalid login credentials."});
    }

    const jti = v4();
    const { accessToken, refreshToken } = generateTokens(existingUser, jti);
    await addRefreshTokenToWhitelist({ jti, refreshToken, userId: existingUser.id });

    res.json({
      accessToken,
      refreshToken,
      userId
    });
  } catch (err) {
    return res.status(500).json({"Error": "Something went wrong."});
  }
});

router.post('/resetPassword',async (req:Request, res:Response, next:NextFunction) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({"Error": "You must provide an email."});
    }
    const existingUser = await findUserByEmail(email);

    if (!existingUser) {
      return res.status(200).json({"Error": "Account does not exist."});
    }
    else{
      const jti = v4(); 
      const resetToken = generateResetToken(existingUser, jti);
      //add mail here and send the token in a mail link... 
      return res.status(200).json({
        resetToken,
      });
    }
  } catch (err) {
    return res.status(500).json({"Error": "Something went wrong."})
  }
});

router.get('/validateResetToken',async (req:Request, res:Response, next:NextFunction) => {
  //for frontend you can check if the link has a valid token or not 
  
  try {

    const { resetToken } = req.body;
    if (!resetToken) {
      return res.status(422).json({"Error": "You must provide an reset Token."});
    }
    const payload = jwt.verify(resetToken, process.env.RESET_PASSWORD_KEY);

    if (!payload) {
      return res.status(401).json({"Error": "Invalid Token."});
    }
    else{
      return res.status(200).json({
        Error: false,
        msg: "Valid Reset Token"
      });
    }
  } catch (err) {
    return res.status(500).json({"Error": "Something went wrong."})
  }
});

router.get('/updatePassword',async (req:Request, res:Response, next:NextFunction) => {
  try {

    const { password, resetToken } = req.body;
      if (!resetToken) {
        return res.status(400).json({"Error": "You must provide an reset Token."});
      }
      const payload = jwt.verify(resetToken, process.env.RESET_PASSWORD_KEY);

      if (!payload) {
        return res.status(401).json({"Error": "Invalid Token."});
      }
      else{
        //update Password
        const user = await UpdatePassword(password, (<any>payload).userId);
        await revokeTokens((<any>payload).userId);
        return res.status(200).json({
          Error: false,
          message: "Password has been reset and all tokens have been revoked."
        });
      }
  } catch (err) {
    return res.status(500).json({"Error": "Something went wrong."})
  }
});

router.post('/logout', async (req:Request, res:Response, next:NextFunction) => {
  try {
    const { refreshToken } = req.body;
    if (!deleteRefreshToken) {
      return res.status(422).json({"Error": "You must provide a RefreshToken id."});
    }
    await deleteRefreshToken(refreshToken);
    return res.status(200).json({"OK": "Token have been revoked."});
  } catch (err) {
    return res.status(500).json({"Error": "Something went wrong."});
  }
});

router.post('/checkAuth', async (req:Request, res:Response, next:NextFunction) => {
  try {
    const { accessToken, refreshToken } = req.body;
    if (!accessToken || !refreshToken) {
      return res.status(401).json({"Error": "You must provide an accessToken and a refreshToken."});
    }
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const savedRefreshToken = await findRefreshTokenById((<any>payload).jti);
    if (!savedRefreshToken || savedRefreshToken.revoked === true) {
      //should log user out and make them sign in again
      return res.status(401).json({"Error": "Refresh token is not valid."});
    }
    const CheckAccess = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
    if(!CheckAccess){
      //genereate new access token
      const user = await findUserById((<any>payload).userId);
      if (!user) {
        return res.status(401).json({"Error": "Refresh token is not valid."});
      }
      const NewaccessToken = generateAccessToken(user);
      return res.status(200).json(
        {
          accessToken: NewaccessToken,
          refreshToken,
          userId: user.id
        }
      );
    //verify access token and check if it is valid
      }
      else{
        return res.status(200).json(
          {
            accessToken,
            refreshToken,
            userId: (<any>payload).userId
          }
        );
      }
  } catch (err) {
    return res.status(500).json({"Error": "Something went wrong."});
}});

router.post('/refreshToken', async (req:Request, res:Response, next:NextFunction) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(422).json({"Error": "You must provide a refresh token."});
    }
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const savedRefreshToken = await findRefreshTokenById((<any>payload).jti);

    if (!savedRefreshToken || savedRefreshToken.revoked === true) {
      //should log user out and make them sign in again
      return res.status(401).json({"Error": "Refresh token is not valid."});
    }

    const hashedToken = hashToken(refreshToken);
    if (hashedToken !== savedRefreshToken.hashedToken) {
      //should log user out and make them sign in again
      return res.status(401).json({"Error": "Refresh token is not valid."});
    }

    const user = await findUserById((<any>payload).userId);
    if (!user) {
      return res.status(401).json({"Error": "Refresh token is not valid."});
    }

    const accessToken = generateAccessToken(user);
    return res.status(200).json({
      accessToken,
    });
  } catch (err) {
    return res.status(500).json({"Error": "Something went wrong."})
  }
});

router.post('/revokeRefreshTokens', async (req:Request, res:Response, next:NextFunction) => {
  try {
    const { userId } = req.body;
    await revokeTokens(userId);
    return res.json({ message: `Tokens revoked for user with id #${userId}` });
  } catch (err) {
    return res.status(500).json({"Error": "Something went wrong."});  
  }
});

export default router;