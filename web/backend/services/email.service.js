import nodemailer from "nodemailer";

const getTransporter = () => {
    return nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
};

export const sendOtpEmail = async (toEmail, otpCode, type = "login") => {
    const transporter = getTransporter();
    const subject =
        type === "register"
            ? "[Blog Genius] Verify your new account"
            : "[Blog Genius] Your sign-in verification code";

    const htmlContent = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 20px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h2 style="color: #0f172a; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.5px;">Blog Genius</h2>
        <p style="color: #64748b; font-size: 13px; margin-top: 4px;">AI SEO & GEO Content Automation</p>
      </div>

      <div style="background-color: #f8fafc; border: 1px solid #f1f5f9; border-radius: 8px; padding: 24px; text-align: center; margin-bottom: 24px;">
        <p style="color: #334155; font-size: 14px; margin-top: 0; margin-bottom: 16px;">
          Use the 6-digit verification code below to complete your ${type === "register" ? "registration" : "login"}:
        </p>
        <div style="font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #2563eb; font-family: monospace; padding: 12px 0;">
          ${otpCode}
        </div>
        <p style="color: #94a3b8; font-size: 12px; margin-bottom: 0; margin-top: 12px;">
          This code will expire in <strong>5 minutes</strong>. Do not share this code with anyone.
        </p>
      </div>

      <p style="color: #64748b; font-size: 12px; line-height: 1.5; margin: 0; text-align: center;">
        If you did not request this email, please ignore it or secure your account.
      </p>
    </div>
  `;

    return transporter.sendMail({
        from: process.env.EMAIL_FROM || `"Blog Genius" <${process.env.SMTP_USER}>`,
        to: toEmail,
        subject,
        html: htmlContent,
    });
};