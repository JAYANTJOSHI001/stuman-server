import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_ID,
    pass: process.env.EMAIL_PASS
  }
});

export const sendReminderEmail = async (to, name) => {
  const mailOptions = {
    from: process.env.EMAIL_ID,
    to,
    subject: 'Stay Active on Codeforces!',
    html: `<p>Hi ${name},</p><p>We noticed you haven't submitted any problems on Codeforces in the last 7 days. Keep practicing to stay sharp!</p>`
  };

  await transporter.sendMail(mailOptions);
};
