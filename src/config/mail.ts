import nodemailer from 'nodemailer';

export let transporter: nodemailer.Transporter;

export async function initMailer() {
  const testAccount = await nodemailer.createTestAccount();

  transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  console.log('📨 Ethereal credentials:');
  console.log('User:', testAccount.user);
  console.log('Pass:', testAccount.pass);
}
