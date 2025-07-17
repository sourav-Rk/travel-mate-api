import { MAIL_CONTENT_PURPOSE } from "./constants";

export function mailContentProvider(purpose: string, data?: any): string {
  console.log("token->", data);
  const { OTP, GUIDE_LOGIN } = MAIL_CONTENT_PURPOSE;

  switch (purpose) {
    case OTP:
      return `
      <div style="max-width: 550px; margin: auto; font-family: 'Segoe UI', Tahoma, sans-serif; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e0e0e0; box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);">
        <div style="background: linear-gradient(to right, #4f46e5, #06b6d4); padding: 24px; color: white; text-align: center;">
          <h2 style="margin: 0; font-size: 24px;">🔐 OTP Verification</h2>
          <p style="margin: 8px 0 0; font-size: 14px;">Verify your email to activate your account</p>
        </div>
        
        <div style="padding: 30px;">
          <p style="font-size: 16px; color: #333;">Hi there 👋,</p>
          <p style="font-size: 15px; color: #555;">Thank you for signing up with <strong>Travel Mate</strong>!</p>
          <p style="font-size: 15px; color: #555;">Your one-time password (OTP) is:</p>
          
          <div style="text-align: center; margin: 24px 0;">
            <span style="display: inline-block; font-size: 28px; background-color: #4f46e5; color: #fff; padding: 14px 30px; border-radius: 10px; font-weight: bold; letter-spacing: 4px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);">
              ${data}
            </span>
          </div>

          <p style="font-size: 14px; color: #888;">⏰ This OTP is valid for <strong>1 minute</strong>. Do not share it with anyone.</p>
          <p style="font-size: 13px; color: #aaa; margin-top: 40px; text-align: center;">
            Cheers,<br/>The Travel Mate Team 🌍
          </p>
        </div>
      </div>
      `;
    case GUIDE_LOGIN:
      const resetUrl = `http://localhost:5173/guide/reset-password?token=${data}`;
      return `
  <div style="max-width: 550px; margin: auto; font-family: 'Segoe UI', Tahoma, sans-serif; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e0e0e0; box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);">
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 24px; color: white; text-align: center;">
      <h2 style="margin: 0; font-size: 24px;">🔑 Password Reset</h2>
      <p style="margin: 8px 0 0; font-size: 14px;">Reset your guide account password</p>
    </div>
    
    <div style="padding: 30px;">
      <p style="font-size: 16px; color: #333;">Hello Guide 👋,</p>
      <p style="font-size: 15px; color: #555;">We received a request to reset your password for your <strong>Travel Mate</strong> guide account.</p>
      <p style="font-size: 15px; color: #555;">Click the link below to reset your password:</p>
      
      <div style="text-align: center; margin: 32px 0;">
        <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3); transition: all 0.3s ease;">
          🔐 Reset Password
        </a>
      </div>
      
      <div style="background: #f8f9fa; border-left: 4px solid #ffc107; padding: 16px; margin: 24px 0; border-radius: 4px;">
        <p style="margin: 0; font-size: 14px; color: #856404;">
          ⚠️ <strong>Important:</strong> This link expires in <strong>15 minutes</strong> for security reasons.
        </p>
      </div>
      
      <p style="font-size: 13px; color: #888; margin-top: 20px;">
        If you didn't request this password reset, please ignore this email. Your account remains secure.
      </p>
      
      <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
      
      <p style="font-size: 13px; color: #aaa; text-align: center;">
        Best regards,<br/>
        The Travel Mate Team 🌍<br/>
        <span style="font-size: 12px;">Making travel experiences extraordinary</span>
      </p>
    </div>
  </div>
  `;

    default:
      return "";
  }
}
