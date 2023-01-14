//This uses the sendgrid api to send emails. 

import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export function getConfirmEmailTemplate(userName: string, confirmUrl: string) {
  return {
    subject: "Roomfin - Confirm your email",
    text: `Hey ${userName},\n\nPlease confirm your email by clicking the following link:\n${confirmUrl}\n`,
    html: `
    <div style="width: 100%; font-family: 'Roboto', sans-serif; padding: 2rem; box-sizing: border-box; text-align: center">
      <h1>Hey, ${userName}</h1>
      <h2>Welcome to Roomfin!</h2>
      <p style="margin-bottom: 4rem">Before you can start using the app, you need to verify your email address. Press the link below to proceed.</p>
      <a href=${confirmUrl} style="background-color: #4338ca; color: white; padding: 1rem 2rem; border-radius: 2rem;text-decoration: none; font-size: 1rem">Confirm your email</a>
    </div>
  `,
  };
}

export function getPasswordResetEmailTemplate(
  userName: string,
  resetUrl: string
) {
  return {
    subject: "Roomfin - Reset your password",
    text: `Hey ${userName},\n\nPlease reset your password by clicking the following link:\n${resetUrl}\n`,
    html: `
    <div style="width: 100%; font-family: 'Roboto', sans-serif; padding: 2rem; box-sizing: border-box; text-align: center">
      <h1>Hey, ${userName} &#128064;</h1>
      <p style="margin-bottom: 4rem">You have requested to reset your password. If you did not make this request, please ignore this email. Otherwise, press the link below to proceed.</p>
      <a href=${resetUrl} style="background-color: #4338ca; color: white; padding: 1rem 2rem; border-radius: 2rem;text-decoration: none; font-size: 1rem">Reset your password</a>
    </div>
  `,
  };
}

export function sendVerifyEmail(to: string, token: string) {
    //not sure what the front end link is going to be.
    const email = getConfirmEmailTemplate(to, `https://roomfin.xyz/auth/confirmEmail?token=${token}&email=${to}`);
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
    const email = getPasswordResetEmailTemplate(to, `https://roomfin.xyz/auth/reset?token=${token}`);
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