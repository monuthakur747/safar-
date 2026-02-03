import nodemailer from "nodemailer";

// Create transporter
const transporter = nodemailer.createTransport({
  service: process.env.MAIL_SERVICE || "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

export interface SendOTPEmailParams {
  email: string;
  otp: string;
  purpose: "signup" | "login" | "password-reset";
}

export async function sendOTPEmail({
  email,
  otp,
  purpose,
}: SendOTPEmailParams): Promise<void> {
  const subject = getSubjectByPurpose(purpose);
  const html = getEmailTemplate(otp, purpose);

  try {
    await transporter.sendMail({
      from: `"Safar Travels" <${process.env.MAIL_USER}>`,
      to: email,
      subject,
      html,
      text: `Your OTP is: ${otp}. This OTP is valid for 10 minutes.`,
    });

    console.log(`[Mail] OTP sent to ${email} for ${purpose}`);
  } catch (error) {
    console.error("[Mail] Error sending email:", error);
    throw new Error("Failed to send OTP email");
  }
}

function getSubjectByPurpose(
  purpose: "signup" | "login" | "password-reset"
): string {
  switch (purpose) {
    case "signup":
      return "Verify Your Email - Safar Travels";
    case "login":
      return "Your Login OTP - Safar Travels";
    case "password-reset":
      return "Reset Your Password - Safar Travels";
    default:
      return "Safar Travels Verification";
  }
}

function getEmailTemplate(
  otp: string,
  purpose: "signup" | "login" | "password-reset"
): string {
  let title = "Verify Your Email";
  let message = "Please enter the following OTP to verify your email:";

  if (purpose === "login") {
    title = "Login Verification";
    message = "Please enter the following OTP to complete your login:";
  } else if (purpose === "password-reset") {
    title = "Password Reset";
    message = "Please enter the following OTP to reset your password:";
  }

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .header { text-align: center; margin-bottom: 30px; }
          .logo { font-size: 28px; color: #ff6b35; font-weight: bold; }
          .content { text-align: center; }
          .otp-box { background-color: #f0f0f0; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .otp-code { font-size: 32px; font-weight: bold; color: #ff6b35; letter-spacing: 5px; }
          .expiry { color: #666; font-size: 12px; margin-top: 10px; }
          .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">✈️ Safar</div>
          </div>
          
          <div class="content">
            <h2>${title}</h2>
            <p>${message}</p>
            
            <div class="otp-box">
              <div class="otp-code">${otp}</div>
              <div class="expiry">This OTP will expire in 10 minutes</div>
            </div>
            
            <p style="color: #666; margin-top: 20px;">
              If you didn't request this, please ignore this email. Do not share this OTP with anyone.
            </p>
          </div>
          
          <div class="footer">
            <p>© 2024 Safar Travels. All rights reserved.</p>
            <p>This is an automated email. Please do not reply.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

// Test mail connection
export async function testMailConnection(): Promise<boolean> {
  try {
    await transporter.verify();
    console.log("[Mail] Connection verified successfully");
    return true;
  } catch (error) {
    console.error("[Mail] Connection failed:", error);
    return false;
  }
}
