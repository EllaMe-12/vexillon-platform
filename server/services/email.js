import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendOtpEmail(email, code) {
  const html = `
    <div style="font-family:Arial,sans-serif;color:#1f1c18;line-height:1.6;">
      <p style="font-size:16px;margin:0 0 16px;">Hello,</p>
      <p style="margin:0 0 16px;">Your VeXillon verification code is:</p>
      <p style="margin:0 0 24px;font-size:24px;font-weight:700;color:#8A6240;">${code}</p>
      <p style="margin:0 0 8px;color:#69655f;font-size:14px;">If you did not request this code, you can safely ignore this message.</p>
    </div>`;

  return transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'Your VeXillon verification code',
    text: `Your VeXillon verification code is ${code}`,
    html,
  });
}
