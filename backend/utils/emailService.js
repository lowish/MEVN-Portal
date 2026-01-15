const nodemailer = require('nodemailer');
require('dotenv').config();

// Verify nodemailer is loaded correctly
if (!nodemailer || typeof nodemailer.createTransport !== 'function') {
  console.error('Nodemailer failed to load properly');
  process.exit(1);
}

// Create reusable transporter
let transporter;

try {
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  console.log('Email transporter created successfully');
} catch (error) {
  console.error('Failed to create email transporter:', error.message);
}

/**
 * Send registration email with credentials
 * @param {Object} studentData - Student information
 * @returns {Promise<boolean>}
 */
const sendRegistrationEmail = async (studentData) => {
  const { email, name, studentNumber } = studentData;

  // Skip email sending if transporter is not configured
  if (!transporter) {
    console.warn('Email transporter not configured. Skipping email.');
    return false;
  }

  // Check if email credentials are configured
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.warn('Email credentials not configured. Skipping email send.');
    return false;
  }

  const mailOptions = {
    from: process.env.EMAIL_FROM || 'HAU Portal <noreply@hau.edu.ph>',
    to: email,
    subject: 'Welcome to Holy Angel University Portal - Registration Successful',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #830e2b; color: white; padding: 20px; text-align: center; }
          .content { background: #f9f9f9; padding: 30px; border: 1px solid #ddd; }
          .credentials { background: white; padding: 20px; margin: 20px 0; border-left: 4px solid #830e2b; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to HAU Portal!</h1>
          </div>
          <div class="content">
            <p>Dear <strong>${name}</strong>,</p>
            <p>Your registration to the Holy Angel University Student Portal has been successful!</p>
            
            <div class="credentials">
              <h3>Your Student Information:</h3>
              <p><strong>Student Number (Username):</strong> ${studentNumber}</p>
              <p>You can now login using your email and the password you created during registration.</p>
            </div>
            
            <p>You can access the portal at: <a href="http://localhost:5173">http://localhost:5173</a></p>
            
            <p>If you did not register for this account, please contact our IT department immediately.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Holy Angel University<br>
            IT Department | Student Portal System</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    console.log('Email sent to:', email);
    return true;
  } catch (error) {
    console.error('Error sending email:', error.message);
    return false;
  }
};

/**
 * Send password reset email
 * @param {Object} data - Reset information
 * @returns {Promise<boolean>}
 */
const sendPasswordResetEmail = async (data) => {
  const { email, name, resetToken } = data;
  
  if (!transporter) {
    console.warn('Email transporter not configured. Skipping email.');
    return false;
  }
  
  const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM || 'HAU Portal <noreply@hau.edu.ph>',
    to: email,
    subject: 'Password Reset Request - HAU Portal',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #830e2b;">Password Reset Request</h2>
        <p>Dear ${name},</p>
        <p>We received a request to reset your password. Click the link below to reset your password:</p>
        <p><a href="${resetLink}" style="background: #830e2b; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a></p>
        <p>This link will expire in 1 hour.</p>
        <p>If you did not request this reset, please ignore this email.</p>
        <br>
        <p>Best regards,<br>HAU IT Department</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Password reset email sent to:', email);
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error.message);
    return false;
  }
};

module.exports = { 
  sendRegistrationEmail,
  sendPasswordResetEmail
};
