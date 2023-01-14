import express, { Request, Response, NextFunction } from 'express';
// to do , jwt.verify in try catch
import bcrypt from "bcrypt";
import jwt  from "jsonwebtoken";
import {v4} from 'uuid'; 
import {
  UpdatePassword,
  findUserByEmail,
  createUserByEmailAndPassword,
  findUserById
} from '../users/services';

import { generateTokens, hashToken, generateResetToken,generateAccessToken, generateEmailToken } from "utils/jwt";


import {
  getUser,
  addRefreshTokenToWhitelist,
  findRefreshTokenById,
  deleteRefreshToken,
  revokeTokens,
  verify,
  getUserEmail,
} from './services';

import { sendResetPasswordEmail, sendVerifyEmail } from 'utils/sendEmail';

const router = express.Router()

router.post('/register', async (req:Request, res:Response, next:NextFunction) => {
  try {
    //console.log(req.body)
    const { email, password, name, LastName } = req.body;
    if (!email || !password || !name || !LastName) {
      return res.status(422).json({"Error": "You must provide an email, password, name and lastName."});
    }

    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return res.status(400).json({"Error": "User with email already exists."});
    }
    
    const user = await createUserByEmailAndPassword(email, password, name, LastName);
    const userId = user.id;
    const jti = v4();
    const { accessToken, refreshToken } = generateTokens(user, jti);
    await addRefreshTokenToWhitelist({ jti, refreshToken, userId: user.id });
    const ConfrimEmailKey = generateEmailToken(user, jti);
    sendVerifyEmail(email, ConfrimEmailKey);
    //console.log(ConfrimEmailKey)
    return res.status(200).json({
      accessToken,
      refreshToken,
      userId,
      user
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({"Error": "An unexpected error occurred while registering your account. Please try again."});
  }
});

router.post('/login', async (req:Request, res:Response, next:NextFunction) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(422).json({"Error": "You must provide an email and password."});
    }

    const existingUser = await findUserByEmail(email);
    
    if (!existingUser) {
      return res.status(401).json({"Error": "An account with the given email and password could not be found."});
    }
    const userId = existingUser.id;
    
    const validPassword = await bcrypt.compare(password, existingUser.password);
    if (!validPassword) {
      return res.status(401).json({"Error": "An account with the given email and password could not be found."});
    }

    const jti = v4();
    const { accessToken, refreshToken } = generateTokens(existingUser, jti);
    await addRefreshTokenToWhitelist({ jti, refreshToken, userId: existingUser.id });
    delete existingUser.password;
    res.json({
      accessToken,
      refreshToken,
      userId,
      user:existingUser
    });
  } catch (err) {
    return res.status(500).json({"Error": "An unexpected error occurred. Please try again."});
  }
});

router.post('/resetPassword',async (req:Request, res:Response, next:NextFunction) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({"Error": "You must provide an email."});
    }
    const existingUser = await findUserByEmail(email);

    if (!existingUser) {
      return res.status(400).json({"Error": "An account with the provided email does not exist."});
    }
    else{
      const jti = v4(); 
      const resetToken = generateResetToken(existingUser, jti);
      sendResetPasswordEmail(email as string, resetToken);
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

router.post('/updatePassword',async (req:Request, res:Response, next:NextFunction) => {
  try {
    const { password, resetToken } = req.body;
      if (!resetToken) {
        return res.status(400).json({"Error": "You must provide an reset Token."});
      }
      //console.log(resetToken)
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
          message: "Password has been reset."
        });
      }
  } catch (err) {
    //console.log(err)
    return res.status(500).json({"Error": "Something went wrong."})
  }
});


router.post('/confirmEmail',async (req:Request, res:Response, next:NextFunction) => {
  try {

    const { emailToken } = req.body;
      if (!emailToken) {
        return res.status(400).json({"Error": "You must provide an reset Token."});
      }
      //console.log(emailToken)
      const payload = jwt.verify(emailToken, process.env.VERIFY_EMAIL_KEY);

      if (!payload) {
        return res.status(401).json({"Error": "Invalid Token."});
      }
        //update Password
        await verify((<any>payload).userId);
        return res.status(200).json({
          message: "Account verified."
        });
  } catch (err) {
    console.log(err)
    return res.status(500).json({"Error": "Something went wrong."})
  }
});

router.post('/sendConfirmationEmail',async (req:Request, res:Response, next:NextFunction) => {
  try {

    const { email } = req.body;
      if (!email) {
        return res.status(400).json({"Error": "You must provide an reset Token."});
      }
      //console.log(email)
      const user = await findUserByEmail(email);
      if (!user.id) {
        return res.status(401).json({"Error": "Go through forgot password process."});
      }
      const jti = v4();
      const ConfrimEmailKey = generateEmailToken(user, jti);
      sendVerifyEmail(email, ConfrimEmailKey);
      return res.status(200).json({
        message: "Email sent."
      });
  } catch (err) {
    //console.log(err)
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
  //console.log(req.body)
  try {
    const { accessToken, refreshToken } = req.body;
    if (!accessToken || !refreshToken || accessToken === "undefined" || refreshToken === "undefined") {
      return res.status(401).json({"Error": "You must provide an accessToken and a refreshToken."});
    }
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const savedRefreshToken = await findRefreshTokenById((<any>payload).jti);
    if (!savedRefreshToken || savedRefreshToken.revoked === true) {
      //should log user out and make them sign in again
      return res.status(401).json({"Error": "Refresh token is not valid."});
    }
    const user = await findUserById((<any>payload).userId);
    delete user.password;
    try {
      const CheckAccess = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
      return res.status(200).json(
        {
          accessToken,
          refreshToken,
          userId: (<any>payload).userId,
          user
        }
      );
    } catch (error) {
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
    }
  } catch (err) {
    console.log(err);
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