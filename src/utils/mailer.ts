import * as nodemailer from 'nodemailer';

const verifyEmailTemplate = (fullName: string, token: string) => {
  return `<h3>Hi ${fullName}</h3>
  <p>please verify your email</p>
  <div><a href="https://mr-zare.ir/verify/${token}">click header to open link.</a></div>
  `;
};

const transporterDetail = {
  host: 'mail.mr-zare.ir',
  post: 465,
  secure: true,
  auth: {
    user: 'test@mr-zare.ir',
    pass: 'EwI(]1aPko(P',
  },
  tls: {
    rejectUnauthorized: false,
  },
};
export const sendEmail = async (email, fullName, fromTitle, token) => {
  const transporter = await nodemailer.createTransport(transporterDetail);
  await transporter.sendMail({
    from: `"${fromTitle}" test@mr-zare.ir`,
    to: email,
    subject: 'verify email',
    html: verifyEmailTemplate(fullName, token),
  });
};
