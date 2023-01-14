//This uses the sendgrid api to send emails. 

import sgMail from '@sendgrid/mail';
import {
  registerEmail,
  resetEmail, updateEmail
} from '../email/email'

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export function sendVerifyEmail(to: string, token: string) {
    //not sure what the front end link is going to be.
    const msg = {
        to,
        from: 'support@roomfin.xyz', 
        subject: 'Verify Account',
        text: '',
        html: registerEmail(token),
      }
      sgMail.send(msg).then((res) => {
        console.log(res[0].statusCode)
        console.log(res[0].headers)
        }).catch((err) => {
        console.log(err)});
}

export function sendResetPasswordEmail(to: string, token: string) {
    const msg = {
        to,
        from: 'support@roomfin.xyz', 
        subject: 'Password Reset',
        text: '',
        html: resetEmail(token),
      }
      sgMail.send(msg).then((res) => {
        console.log(res[0].statusCode)
        console.log(res[0].headers)
        }).catch((err) => {
        console.log(err)});
}

export function sendUpdatePasswordEmail(to: string, token: string) {
  const msg = {
      to,
      from: 'support@roomfin.xyz', 
      subject: 'Update Password',
      text: '',
      html: updateEmail(token),
    }
    sgMail.send(msg).then((res) => {
      console.log(res[0].statusCode)
      console.log(res[0].headers)
      }).catch((err) => {
      console.log(err)});
}