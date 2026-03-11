import { BadRequestException } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

export const sendEmail = async (data: Mail.Options) => {
  if (!data.html && !data.attachments?.length && !data.text) {
    throw new BadRequestException('Missing Email Content');
  }

  const transporter: Transporter<
    SMTPTransport.SentMessageInfo,
    SMTPTransport.Options
  > = createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const info = await transporter.sendMail({
    ...data,
    from: `"Route Academy" <${process.env.EMAIL}>`,
  });

  console.log('Message Sent: ', info.messageId);
};
