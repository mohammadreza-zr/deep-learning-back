import * as nodemailer from 'nodemailer';

const verifyEmailTemplate = (fullName: string, token: string) => {
  return `<h3>Hi ${fullName}</h3>
  <p>please verify your email</p>
  <div><a href="http://localhost:3030/auth/verify/${token}">click header to open link.</a></div>
  `;
};

const transporterDetail = {
  host: 'mail.asalsatiya.com',
  post: 465,
  secure: true,
  auth: {
    user: 'test@asalsatiya.com',
    pass: 'EwI(]1aPko(P',
  },
  tls: {
    rejectUnauthorized: false,
  },
};
export const sendEmail = async (
  email: string,
  fullName: string,
  fromTitle: string,
  token: string,
) => {
  try {
    const transporter = await nodemailer.createTransport(transporterDetail);
    await transporter.sendMail({
      from: `"${fromTitle}" test@mr-zare.ir`,
      to: email,
      subject: 'verify email',
      html: verifyEmailTemplate(fullName, token),
    });
  } catch (error) {
    return 'error in send email!';
  }
};
