import "server-only";
import nodemailer from "nodemailer";

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
  }
  return transporter;
}

export async function sendMail(options: { to: string; subject: string; html: string }) {
  await getTransporter().sendMail({
    from: `"Aurasil" <${process.env.GMAIL_USER}>`,
    ...options,
  });
}
