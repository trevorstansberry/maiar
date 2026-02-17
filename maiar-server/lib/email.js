import nodemailer from 'nodemailer'
import { config } from './config.js'

const transporter = nodemailer.createTransport({
  host: config.smtp.host,
  port: config.smtp.port,
  secure: config.smtp.port === 465,
  auth: { user: config.smtp.user, pass: config.smtp.pass }
})

/**
 * Send a password reset email with a one-time link.
 * Failures are logged but never surfaced to callers (prevents email enumeration).
 */
export async function sendPasswordResetEmail(toEmail, resetUrl) {
  try {
    await transporter.sendMail({
      from: config.smtp.from,
      to: toEmail,
      subject: 'Reset your Maiar password',
      text: `Reset your password: ${resetUrl}\n\nThis link expires in 30 minutes. If you didn't request this, ignore this email.`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px;">
          <h2 style="font-size: 20px; font-weight: 600; margin: 0 0 16px;">Reset your password</h2>
          <p style="color: #555; font-size: 14px; line-height: 1.6; margin: 0 0 24px;">
            Click the button below to set a new password for your Maiar account.
          </p>
          <a href="${resetUrl}" style="display: inline-block; background: #ff630f; color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 500;">
            Reset password
          </a>
          <p style="color: #999; font-size: 12px; margin: 24px 0 0;">
            This link expires in 30 minutes. If you didn't request this, ignore this email.
          </p>
        </div>
      `
    })
  } catch (err) {
    console.error('[EMAIL] Failed to send reset to', toEmail, err.message)
  }
}

/**
 * Verify SMTP transport is reachable. Call on startup — logs a warning if unreachable.
 */
export async function verifyTransport() {
  if (!config.smtp.user || !config.smtp.pass) {
    console.warn('[EMAIL] SMTP credentials not configured. Password reset emails will not be sent.')
    return
  }
  await transporter.verify()
}
