import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import crypto from "crypto";
import nodemailer from "nodemailer";

// Create Gmail Transporter
const createTransporter = () => {
  const emailUser = process.env.EMAIL_USER;
  const emailPassword = process.env.EMAIL_PASSWORD;

  if (!emailUser || !emailPassword) {
    console.error("❌ Email credentials missing!");
    console.error({
      EMAIL_USER: emailUser ? "✓ Set" : "✗ Missing",
      EMAIL_PASSWORD: emailPassword ? "✓ Set" : "✗ Missing",
    });
    return null;
  }

  console.log("📧 Email Config:", {
    user: emailUser,
    passwordLength: emailPassword.length,
  });

  return nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: emailUser,
      pass: emailPassword,
    },
  });
};

export async function POST(req) {
  try {
    const { email } = await req.json();

    // Validate email input
    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();
    console.log("✅ Database connected");

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    console.log("🔍 User lookup:", email, user ? "Found" : "Not found");

    if (!user) {
      // Security: Don't reveal if user exists
      return NextResponse.json({
        success: true,
        message: "If an account exists with this email, you will receive a password reset link.",
      });
    }

    // Check if user uses Google OAuth
    if (user.provider === "google" && !user.password) {
      return NextResponse.json(
        {
          success: false,
          error: "This account uses Google sign-in. Please use 'Sign in with Google' instead.",
        },
        { status: 400 }
      );
    }

    // Generate reset token (NO HASHING)
    const resetToken = crypto.randomBytes(32).toString("hex");
    
    // Save token to database
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    console.log("✅ Token saved:", {
      email: user.email,
      token: resetToken.substring(0, 10) + "...",
      expires: new Date(user.resetPasswordExpires).toLocaleString(),
    });

    // Create email transporter
    const transporter = createTransporter();

    if (!transporter) {
      // Development mode - log reset URL
      const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;
      console.log("\n🔐 DEVELOPMENT MODE - PASSWORD RESET URL:");
      console.log(resetUrl);
      console.log("\n");

      return NextResponse.json({
        success: true,
        message: "Email service unavailable. Check server logs for reset link.",
        devMode: true,
        resetUrl: resetUrl, // Only in dev
      });
    }

    // Create reset URL
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;

    // Email content
    const mailOptions = {
      from: `"7even Game Hub" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Password Reset Request - 7even Game Hub",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 30px; text-align: center;">
                      <h1 style="color: #ffffff; margin: 0; font-size: 28px;">🎮 7even Game Hub</h1>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px 30px;">
                      <h2 style="color: #333333; margin: 0 0 20px 0; font-size: 24px;">Password Reset Request</h2>
                      
                      <p style="color: #555555; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0;">
                        Hello <strong>${user.name || "User"}</strong>,
                      </p>
                      
                      <p style="color: #555555; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0;">
                        We received a request to reset your password for your 7even Game Hub account.
                      </p>
                      
                      <p style="color: #555555; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                        Click the button below to reset your password:
                      </p>
                      
                      <!-- Button -->
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center" style="padding: 0 0 30px 0;">
                            <a href="${resetUrl}" 
                               style="display: inline-block; padding: 16px 40px; background-color: #f97316; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(249, 115, 22, 0.3);">
                              Reset My Password
                            </a>
                          </td>
                        </tr>
                      </table>
                      
                      <p style="color: #555555; font-size: 14px; line-height: 1.6; margin: 0 0 10px 0;">
                        Or copy and paste this link into your browser:
                      </p>
                      
                      <p style="color: #f97316; word-break: break-all; font-size: 13px; background-color: #f9fafb; padding: 15px; border-radius: 6px; border-left: 4px solid #f97316; margin: 0 0 30px 0;">
                        ${resetUrl}
                      </p>
                      
                      <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 6px; margin: 0 0 30px 0;">
                        <p style="color: #92400e; font-size: 14px; margin: 0; line-height: 1.6;">
                          ⚠️ <strong>Important:</strong> This link will expire in <strong>1 hour</strong>.
                        </p>
                      </div>
                      
                      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                      
                      <p style="color: #6b7280; font-size: 13px; line-height: 1.6; margin: 0;">
                        If you didn't request this password reset, please ignore this email. Your password will remain unchanged. For security reasons, we recommend changing your password regularly.
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f9fafb; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                      <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                        © ${new Date().getFullYear()} 7even Game Hub. All rights reserved.
                      </p>
                      <p style="color: #9ca3af; font-size: 12px; margin: 10px 0 0 0;">
                        This is an automated message, please do not reply to this email.
                      </p>
                    </td>
                  </tr>
                  
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    };

    console.log("📧 Attempting to send email to:", user.email);

    // Send email
    const info = await transporter.sendMail(mailOptions);

    console.log("✅ Email sent successfully!");
    console.log("Message ID:", info.messageId);

    return NextResponse.json({
      success: true,
      message: "Password reset link sent to your email.",
    });

  } catch (error) {
    console.error("❌ Forgot password error:", error);

    // Detailed error logging
    if (error.code) {
      console.error("Error code:", error.code);
    }
    if (error.response) {
      console.error("SMTP Response:", error.response);
    }
    if (error.responseCode) {
      console.error("Response code:", error.responseCode);
    }
    if (error.command) {
      console.error("Failed command:", error.command);
    }

    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to send reset email. Please try again later." 
      },
      { status: 500 }
    );
  }
}