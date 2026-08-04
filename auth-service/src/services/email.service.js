// ===========================================
// Email Service
// ===========================================

import nodemailer from 'nodemailer';

import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

/**
 * Creates and configures the SMTP transporter.
 */
const createTransporter = () => {
  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  });
};

const transporter = createTransporter();

/**
 * Email templates for different notification types.
 */
const emailTemplates = {
  /**
   * Email verification template.
   * @param {string} name - User's name
   * @param {string} verificationUrl - URL to verify email
   * @returns {Object} Email content
   */
  verification: (name, verificationUrl) => ({
    subject: 'Verify Your DevBattle Account',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: #fff; margin: 0; font-size: 28px;">DevBattle</h1>
        </div>
        <div style="background: #ffffff; padding: 40px; border: 1px solid #e8e8e8; border-top: none; border-radius: 0 0 10px 10px;">
          <h2 style="color: #1a1a2e;">Welcome, ${name}!</h2>
          <p>Thank you for registering with DevBattle. Please verify your email address to activate your account.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #fff; padding: 14px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 16px;">Verify Email</a>
          </div>
          <p style="font-size: 14px; color: #666;">If the button doesn't work, copy and paste this link:</p>
          <p style="font-size: 13px; color: #667eea; word-break: break-all;">${verificationUrl}</p>
          <p style="font-size: 13px; color: #999;">This link will expire in 24 hours.</p>
          <hr style="border: none; border-top: 1px solid #e8e8e8; margin: 20px 0;">
          <p style="font-size: 12px; color: #999; text-align: center;">If you didn't create an account, you can safely ignore this email.</p>
        </div>
      </body>
      </html>
    `,
  }),

  /**
   * Password reset email template.
   * @param {string} name - User's name
   * @param {string} resetUrl - URL to reset password
   * @returns {Object} Email content
   */
  passwordReset: (name, resetUrl) => ({
    subject: 'Reset Your DevBattle Password',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Password</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: #fff; margin: 0; font-size: 28px;">DevBattle</h1>
        </div>
        <div style="background: #ffffff; padding: 40px; border: 1px solid #e8e8e8; border-top: none; border-radius: 0 0 10px 10px;">
          <h2 style="color: #1a1a2e;">Password Reset Request</h2>
          <p>Hello ${name},</p>
          <p>We received a request to reset the password for your DevBattle account. Click the button below to set a new password.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #fff; padding: 14px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 16px;">Reset Password</a>
          </div>
          <p style="font-size: 14px; color: #666;">If the button doesn't work, copy and paste this link:</p>
          <p style="font-size: 13px; color: #667eea; word-break: break-all;">${resetUrl}</p>
          <p style="font-size: 13px; color: #999;">This link will expire in 1 hour.</p>
          <hr style="border: none; border-top: 1px solid #e8e8e8; margin: 20px 0;">
          <p style="font-size: 12px; color: #999; text-align: center;">If you didn't request a password reset, please ignore this email or secure your account.</p>
        </div>
      </body>
      </html>
    `,
  }),

  /**
   * Password changed confirmation email template.
   * @param {string} name - User's name
   * @returns {Object} Email content
   */
  passwordChanged: (name) => ({
    subject: 'Your DevBattle Password Has Been Changed',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Changed</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: #fff; margin: 0; font-size: 28px;">DevBattle</h1>
        </div>
        <div style="background: #ffffff; padding: 40px; border: 1px solid #e8e8e8; border-top: none; border-radius: 0 0 10px 10px;">
          <h2 style="color: #1a1a2e;">Password Changed Successfully</h2>
          <p>Hello ${name},</p>
          <p>Your DevBattle account password has been changed successfully.</p>
          <div style="background: #f0f4ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #333;"><strong>If you made this change:</strong> No further action is needed.</p>
            <p style="margin: 10px 0 0 0; color: #333;"><strong>If you didn't make this change:</strong> Please reset your password immediately and contact our support team.</p>
          </div>
          <hr style="border: none; border-top: 1px solid #e8e8e8; margin: 20px 0;">
          <p style="font-size: 12px; color: #999; text-align: center;">This is an automated notification from DevBattle.</p>
        </div>
      </body>
      </html>
    `,
  }),
};

/**
 * Email service class for sending notifications.
 */
class EmailService {
  /**
   * Send an email.
   * @param {Object} options - Email options
   * @param {string} options.to - Recipient email
   * @param {string} options.subject - Email subject
   * @param {string} options.html - HTML email body
   * @returns {Promise<boolean>} True if sent successfully
   */
  async sendEmail({ to, subject, html }) {
    try {
      const info = await transporter.sendMail({
        from: `"${env.SMTP_FROM_NAME}" <${env.SMTP_FROM_EMAIL}>`,
        to,
        subject,
        html,
      });

      logger.info(`Email sent successfully to ${to}`, { messageId: info.messageId });
      return true;
    } catch (error) {
      logger.error(`Failed to send email to ${to}:`, error);
      return false;
    }
  }

  /**
   * Send email verification email.
   * @param {Object} user - User object
   * @param {string} user.email - User email
   * @param {string} user.name - User name
   * @param {string} token - Verification token
   * @returns {Promise<boolean>}
   */
  async sendVerificationEmail(user, token) {
    const verificationUrl = `${env.VERIFY_EMAIL_URL}?token=${token}`;
    const template = emailTemplates.verification(user.name, verificationUrl);

    return this.sendEmail({
      to: user.email,
      subject: template.subject,
      html: template.html,
    });
  }

  /**
   * Send password reset email.
   * @param {Object} user - User object
   * @param {string} user.email - User email
   * @param {string} user.name - User name
   * @param {string} token - Reset token
   * @returns {Promise<boolean>}
   */
  async sendPasswordResetEmail(user, token) {
    const resetUrl = `${env.RESET_PASSWORD_URL}?token=${token}`;
    const template = emailTemplates.passwordReset(user.name, resetUrl);

    return this.sendEmail({
      to: user.email,
      subject: template.subject,
      html: template.html,
    });
  }

  /**
   * Send password changed confirmation email.
   * @param {Object} user - User object
   * @param {string} user.email - User email
   * @param {string} user.name - User name
   * @returns {Promise<boolean>}
   */
  async sendPasswordChangedEmail(user) {
    const template = emailTemplates.passwordChanged(user.name);

    return this.sendEmail({
      to: user.email,
      subject: template.subject,
      html: template.html,
    });
  }
}

export default new EmailService();
