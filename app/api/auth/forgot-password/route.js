import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import crypto from "crypto";
import nodemailer from "nodemailer";

// Gmail SMTP Transporter
const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.error("❌ Email credentials not configured!");
    console.error("Missing environment variables:", {
      EMAIL_USER: !process.env.EMAIL_USER,
      EMAIL_PASSWORD: !process.env.EMAIL_PASSWORD,
    });
    return null;
  }

  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Don't reveal if user exists or not (security best practice)
      return NextResponse.json({
        success: true,
        message:
          "If an account exists with this email, you will receive a password reset link.",
      });
    }

    // Prevent Google-auth user from changing password
    if (user.provider === "google" && !user.password) {
      return NextResponse.json(
        {
          success: false,
          error:
            "This account uses Google sign-in. Please use 'Sign in with Google' instead.",
        },
        { status: 400 }
      );
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const transporter = createTransporter();

    // Development fallback if email is not configured
    if (!transporter) {
      console.log("\n🔐 PASSWORD RESET URL (DEV MODE)");
      console.log(
        `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`
      );

      return NextResponse.json({
        success: true,
        message: "Email disabled. Check server logs for reset link.",
        devMode: true,
      });
    }

    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: `"7even Game Hub" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Password Reset Request - 7even Game Hub",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-top: 0;">Password Reset Request</h2>
            <p style="color: #555; font-size: 16px;">Hello ${user.name || "User"},</p>
            <p style="color: #555; font-size: 16px;">
              We received a request to reset your password for your 7even Game Hub account.
            </p>
            <p style="color: #555; font-size: 16px;">
              Click the button below to reset your password:
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a 
                href="${resetUrl}" 
                style="display: inline-block; padding: 14px 30px; background-color: #f97316; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;"
              >
                Reset Password
              </a>
            </div>
            <p style="color: #555; font-size: 14px;">
              Or copy and paste this link into your browser:
            </p>
            <p style="color: #f97316; word-break: break-all; font-size: 14px; background-color: #f5f5f5; padding: 10px; border-radius: 5px;">
              ${resetUrl}
            </p>
            <p style="color: #555; font-size: 14px; margin-top: 20px;">
              This link will expire in <strong>1 hour</strong>.
            </p>
            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
            <p style="color: #999; font-size: 12px; margin-bottom: 0;">
              If you didn't request this password reset, please ignore this email. Your password will remain unchanged.
            </p>
          </div>
        </div>
      `,
    };

    console.log("📧 Attempting to send email to:", user.email);

    await transporter.sendMail(mailOptions);

    console.log("✅ Email sent successfully to:", user.email);

    return NextResponse.json({
      success: true,
      message: "Password reset link sent to your email.",
    });
  } catch (error) {
    console.error("❌ Forgot password error:", error);

    // More detailed error logging
    if (error.code) {
      console.error("Error code:", error.code);
    }
    if (error.response) {
      console.error("SMTP Response:", error.response);
    }
    if (error.responseCode) {
      console.error("Response code:", error.responseCode);
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