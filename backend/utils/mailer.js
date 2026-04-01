const nodemailer = require("nodemailer");

// Create a reusable transporter
// In production, these should come from process.env (e.g. SMTP_HOST, SMTP_USER, SMTP_PASS)
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.ethereal.email",
    port: process.env.SMTP_PORT || 587,
    auth: {
        user: process.env.SMTP_USER || "test@ethereal.email",
        pass: process.env.SMTP_PASS || "testpass",
    },
});

const sendOTP = async (toEmail, otpCode) => {
    // Always log the OTP to the console so it's easy to test locally
    // even if no real email provider is configured yet!
    console.log(`\n================================`);
    console.log(`✉️ MOCK EMAIL SENT TO: ${toEmail}`);
    console.log(`🔐 OTP CODE: ${otpCode}`);
    console.log(`================================\n`);

    // If real credentials exist, it will actually send the email
    try {
        if (process.env.SMTP_HOST && process.env.SMTP_USER) {
            await transporter.sendMail({
                from: '"ProjectMate Support" <noreply@projectmate.com>',
                to: toEmail,
                subject: "Your ProjectMate Verification Code",
                text: `Your OTP verification code is: ${otpCode}. It is valid for 15 minutes.`,
                html: `<p>Your OTP verification code is: <strong>${otpCode}</strong></p><p>It is valid for 15 minutes.</p>`,
            });
            console.log(`Real email successfully dispatched to ${toEmail}`);
        }
    } catch (error) {
        console.error("Failed to send real email via Nodemailer:", error);
    }
};

module.exports = {
    sendOTP,
};
