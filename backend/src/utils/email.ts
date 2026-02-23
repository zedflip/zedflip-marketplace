// Email utility for ZedFlip
// Using nodemailer for sending emails

interface EmailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

export const sendEmail = async (
  to: string,
  subject: string,
  html: string
): Promise<EmailResponse> => {
  try {
    // TODO: Integrate with actual email provider (nodemailer, SendGrid, etc.)
    // For now, just log the email
    console.log(`Email sent to ${to}:`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${html}`);
    
    return {
      success: true,
      messageId: `email_${Date.now()}`,
    };
  } catch (error) {
    console.error('Email sending error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email',
    };
  }
};

export const sendVerificationEmail = async (
  email: string,
  code: string
): Promise<EmailResponse> => {
  const subject = 'Verify your ZedFlip account';
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background-color: #F8F9FA;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #FFFFFF;
          border-radius: 16px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        .header {
          background: linear-gradient(135deg, #E85D04 0%, #DC2F02 100%);
          padding: 40px 20px;
          text-align: center;
        }
        .header h1 {
          color: #FFFFFF;
          margin: 0;
          font-size: 28px;
          font-weight: 700;
        }
        .content {
          padding: 40px 30px;
        }
        .code-box {
          background-color: #F8F9FA;
          border: 2px dashed #E85D04;
          border-radius: 12px;
          padding: 30px;
          text-align: center;
          margin: 30px 0;
        }
        .code {
          font-size: 36px;
          font-weight: 700;
          color: #E85D04;
          letter-spacing: 8px;
          font-family: 'Courier New', monospace;
        }
        .text {
          color: #212529;
          font-size: 16px;
          line-height: 1.6;
          margin: 20px 0;
        }
        .footer {
          background-color: #F8F9FA;
          padding: 20px;
          text-align: center;
          color: #6C757D;
          font-size: 14px;
        }
        .button {
          display: inline-block;
          background: linear-gradient(135deg, #E85D04 0%, #DC2F02 100%);
          color: #FFFFFF;
          text-decoration: none;
          padding: 14px 32px;
          border-radius: 12px;
          font-weight: 600;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔐 ZedFlip Verification</h1>
        </div>
        <div class="content">
          <p class="text">Welcome to ZedFlip! Please verify your email address to complete your registration.</p>
          <p class="text">Your verification code is:</p>
          <div class="code-box">
            <div class="code">${code}</div>
          </div>
          <p class="text">This code will expire in <strong>10 minutes</strong>.</p>
          <p class="text">If you didn't create an account on ZedFlip, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>© 2026 ZedFlip - Zambia's Second-Hand Marketplace</p>
          <p>This email was sent from admin@zedflip.com</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  return sendEmail(email, subject, html);
};

export const sendWelcomeEmail = async (
  email: string,
  name: string
): Promise<EmailResponse> => {
  const subject = 'Welcome to ZedFlip!';
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background-color: #F8F9FA;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #FFFFFF;
          border-radius: 16px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        .header {
          background: linear-gradient(135deg, #E85D04 0%, #DC2F02 100%);
          padding: 40px 20px;
          text-align: center;
        }
        .header h1 {
          color: #FFFFFF;
          margin: 0;
          font-size: 28px;
          font-weight: 700;
        }
        .content {
          padding: 40px 30px;
        }
        .text {
          color: #212529;
          font-size: 16px;
          line-height: 1.6;
          margin: 20px 0;
        }
        .footer {
          background-color: #F8F9FA;
          padding: 20px;
          text-align: center;
          color: #6C757D;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Welcome to ZedFlip!</h1>
        </div>
        <div class="content">
          <p class="text">Hi ${name},</p>
          <p class="text">Your account has been successfully verified! You can now start buying and selling on ZedFlip.</p>
          <p class="text">Start exploring amazing deals or list your first item today!</p>
        </div>
        <div class="footer">
          <p>© 2026 ZedFlip - Zambia's Second-Hand Marketplace</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  return sendEmail(email, subject, html);
};

export default { sendEmail, sendVerificationEmail, sendWelcomeEmail };
