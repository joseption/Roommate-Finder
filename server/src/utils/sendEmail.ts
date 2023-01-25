//This uses the sendgrid api to send emails. 

import sgMail from '@sendgrid/mail';
import { env } from 'middleware';
import {
  registerEmail,
  resetEmail, updateEmail
} from '../email/email'

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// JA TODO NEED TO REPLACE IMAGE LINKS WHERE ACTUAL IMAGES ARE STORED

export function getConfirmEmailTemplate(userName: string, confirmUrl: string) {
  let confirmUrlTrim = confirmUrl.substring(0,50);
  return {
    subject: "RoomFin - Email Verification",
    text: `Hey ${userName},\n\nPlease confirm your email by clicking the following link:\n${confirmUrl}\n`,
    html: `<html><head><meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1" /><style> .container { background-color: white; } @media only screen and (max-width: 541px) { .content { padding: 10px; } } @media only screen and (min-width: 541px) { .content { padding: 40px; width: 400px; margin: auto; background-color: #F0F2F5; border-radius: 20px; } .container { padding: 20px; } } </style></head><body> <div class='container'> <div class='content'> <img style='height: 75px; object-fit: contain; margin-bottom: 20px; width: 100%;' src='../client/assets/images/logo.png'> <div style='font-weight: bold;font-size: 25px;'>Welcome</div> <div style='font-size: 16px;color: #4B4B4B'>Thanks for registering with us!</div> <div style='padding: 8px 20px; border-radius: 10px; width: fit-content; background-color: #54BE66; box-shadow: #4BAB5B -3px 3px 0px; margin: 20px 0 0 auto'><a href='${confirmUrl}' style='font-weight: bold; font-size: 25px;text-decoration: none; color: white;white-space: nowrap;'>Verify Account</a></div> <div style='color: #4B4B4B; width: fit-content; margin: 20px 0 20px auto;text-align:right;'>Click the button or visit the link below to finish activating your account and start finding your perfect roommates.</div> <hr style='border-top: 1px solid #D2D4D9; width: 100%' /> <div style='margin: 20px auto 20px auto; font-size: 14px; width: fit-content;width: 100%;'> <div style='text-align: center;color:#4B4B4B; font-weight: bold;'>Please do not share this link</div> <a style='text-decoration:none; color:#418DFC;width: fit-content; display: block; margin: auto; text-align: center;' href='${confirmUrl}'>${confirmUrlTrim}...</a> </div> <hr style='border-top: 1px solid #D2D4D9; width: 100%' /> <div style='color: #65676B; font-size: 14px; font-style: italic; margin-top: 20px; text-align: center;'>This email was automated from our service by <a style='text-decoration:none; color:#418DFC;' href='mailto:${userName}'>${userName}</a> for email verification. If you did not request this email, disregard and delete it.</div> </div> </div> </body></html>`,
  };
}

export function getPasswordResetEmailTemplate(
  userName: string,
  resetUrl: string
) {
  let resetUrlTrim = resetUrl.substring(0,50);
  return {
    subject: "RoomFin - Password Reset Request",
    text: `Hey ${userName},\n\nPlease reset your password by clicking the following link:\n${resetUrl}\n`,
    html: `<html><head><meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1" /><style> .container { background-color: white; } @media only screen and (max-width: 541px) { .content { padding: 10px; } } @media only screen and (min-width: 541px) { .content { padding: 40px; width: 400px; margin: auto; background-color: #F0F2F5; border-radius: 20px; } .container { padding: 20px; } } </style></head><body> <div class='container'> <div class='content'> <img style='height: 75px; object-fit: contain; margin-bottom: 20px; width: 100%;' src='../client/assets/images/logo.png'> <div style='font-weight: bold;font-size: 25px;'>Reset Password</div> <div style='font-size: 16px;color: #4B4B4B'>Let's get you back into your account</div> <div style='padding: 8px 20px; border-radius: 10px; width: fit-content; background-color: #54BE66; box-shadow: #4BAB5B -3px 3px 0px; margin: 20px 0 0 auto'><a href='${resetUrl}' style='font-weight: bold; font-size: 25px;text-decoration: none; color: white;white-space: nowrap;'>Reset Password</a></div> <div style='color: #4B4B4B; width: fit-content; margin: 20px 0 20px auto;text-align:right;'>Click the button or visit the link to reset your account and continue finding your perfect roommates.</div> <hr style='border-top: 1px solid #D2D4D9; width: 100%' /> <div style='margin: 20px auto 20px auto; font-size: 14px; width: fit-content;width: 100%;'> <div style='text-align: center;color:#4B4B4B; font-weight: bold;'>Please do not share this link</div> <a style='text-decoration:none; color:#418DFC;width: fit-content; display: block; margin: auto; text-align: center;' href='${resetUrl}'>${resetUrlTrim}...</a> </div> <hr style='border-top: 1px solid #D2D4D9; width: 100%' /> <div style='color: #65676B; font-size: 14px; font-style: italic; margin-top: 20px; text-align: center;'>This email was automated from our service by <a style='text-decoration:none; color:#418DFC;' href='mailto:${userName}'>${userName}</a> for a password reset. If you did not request this email, disregard and delete it.</div> </div> </div> </body></html>`,
  };
}

export function getPasswordUpdateEmailTemplate(
  userName: string,
  resetUrl: string
) {
  let resetUrlTrim = resetUrl.substring(0,50);
  return {
    subject: "RoomFin - Password Update Request",
    text: `Hey ${userName},\n\nPlease update your password by clicking the following link:\n${resetUrl}\n`,
    html: `<html><head><meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1" /><style> .container { background-color: white; } @media only screen and (max-width: 541px) { .content { padding: 10px; } } @media only screen and (min-width: 541px) { .content { padding: 40px; width: 400px; margin: auto; background-color: #F0F2F5; border-radius: 20px; } .container { padding: 20px; } } </style></head><body> <div class='container'> <div class='content'> <img style='height: 75px; object-fit: contain; margin-bottom: 20px; width: 100%;' src='../client/assets/images/logo.png'> <div style='font-weight: bold;font-size: 25px;'>Update Password</div> <div style='font-size: 16px;color: #4B4B4B'>Let's update that old account password</div> <div style='padding: 8px 20px; border-radius: 10px; width: fit-content; background-color: #54BE66; box-shadow: #4BAB5B -3px 3px 0px; margin: 20px 0 0 auto'><a href='${resetUrl}' style='font-weight: bold; font-size: 25px;text-decoration: none; color: white;white-space: nowrap;'>Update Password</a></div> <div style='color: #4B4B4B; width: fit-content; margin: 20px 0 20px auto;text-align:right;'>Click the button or visit the link to update your account and continue finding your perfect roommates.</div> <hr style='border-top: 1px solid #D2D4D9; width: 100%' /> <div style='margin: 20px auto 20px auto; font-size: 14px; width: fit-content;width: 100%;'> <div style='text-align: center;color:#4B4B4B; font-weight: bold;'>Please do not share this link</div> <a style='text-decoration:none; color:#418DFC;width: fit-content; display: block; margin: auto; text-align: center;' href='${resetUrl}'>${resetUrlTrim}...</a> </div> <hr style='border-top: 1px solid #D2D4D9; width: 100%' /> <div style='color: #65676B; font-size: 14px; font-style: italic; margin-top: 20px; text-align: center;'>This email was automated from our service by <a style='text-decoration:none; color:#418DFC;' href='mailto:${userName}'>${userName}</a> for a password update. If you did not request this email, disregard and delete it.</div> </div> </div> </body></html>`,
  };
}

export function sendVerifyEmail(to: string, token: string) {
    //not sure what the front end link is going to be.
    const email = getConfirmEmailTemplate(to, `${env.clientURL}/auth/confirmEmail?token=${token}&email=${to}`);
    const msg = {
        to,
        from: 'support@roomfin.xyz', 
        subject: email.subject,
        text: email.text,
        html: email.html,      
      }
      sgMail.send(msg).then((res) => {
        console.log(res[0].statusCode)
        console.log(res[0].headers)
        }).catch((err) => {
        console.log(err)});
}

export function sendResetPasswordEmail(to: string, token: string) {
    const email = getPasswordResetEmailTemplate(to, `${env.clientURL}/auth/reset?token=${token}`);
    const msg = {
      to,
      from: 'support@roomfin.xyz', 
      subject: email.subject,
      text: email.text,
      html: email.html,
    }      
    sgMail.send(msg).then((res) => {
        console.log(res[0].statusCode)
        console.log(res[0].headers)
        }).catch((err) => {
        console.log(err)});
}

export function sendUpdatePasswordEmail(to: string, token: string) {
  const email = getPasswordUpdateEmailTemplate(to, `${env.clientURL}/auth/update?token=${token}`);
  const msg = {
      to,
      from: 'support@roomfin.xyz', 
      subject: email.subject,
      text: email.text,
      html: email.html,
    }
    sgMail.send(msg).then((res) => {
      console.log(res[0].statusCode)
      console.log(res[0].headers)
      }).catch((err) => {
      console.log(err)});
}