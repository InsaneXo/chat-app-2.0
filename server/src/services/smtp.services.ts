import nodemailer from "nodemailer"
import { MailOptionsTypes } from "../types/types";

const transporter = nodemailer.createTransport({
    service: process.env.SMTP_SERVICE,
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
})

 const sendMail = async ({ subject, to, text, html, attachments }: MailOptionsTypes) => {
    try {
        const mailOptions = {
            from: process.env.SMTP_EMAIL,
            to,
            subject,
            text,
            html,
            attachments
        };
        await transporter.sendMail(mailOptions);
        console.log("✅ Email sent successfully");
    } catch (error) {
        console.error("❌ Email send error:", error);
        throw error;
    }
};

export default sendMail