const nodemailer = require('nodemailer');

exports.handler = async function (event, context) {
  // CORS Headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ success: false, message: 'Method Not Allowed' })
    };
  }

  try {
    let bodyData = {};
    try {
      bodyData = JSON.parse(event.body);
    } catch (parseErr) {
      bodyData = {};
    }

    const { name, email, subject, message } = bodyData;

    if (!name || !email || !message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, message: 'Please fill out all required fields.' })
      };
    }

    const smtpUser = process.env.SMTP_USER || 'ksptechsolustions@gmail.com';
    const smtpPass = (process.env.SMTP_PASS || 'ybsx dtre scey yrxv').replace(/\s+/g, '');
    const recipient = process.env.RECIPIENT_EMAIL || 'kp154437@gmail.com';

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: smtpUser,
        pass: smtpPass
      }
    });

    const mailOptions = {
      from: `"Portfolio Contact Form" <${smtpUser}>`,
      to: recipient,
      replyTo: `"${name}" <${email}>`,
      subject: `[Portfolio Inquiry] ${subject || 'New Message from Website'}`,
      text: `Sender Name: ${name}\nSender Email: ${email}\nSubject: ${subject || 'N/A'}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
          <h2 style="color: #4f46e5; margin-top: 0; margin-bottom: 16px;">New Message from Portfolio Website</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <tr>
              <td style="padding: 10px 0; font-weight: bold; width: 120px; color: #475569; border-bottom: 1px solid #f1f5f9;">Sender Name:</td>
              <td style="padding: 10px 0; color: #0f172a; border-bottom: 1px solid #f1f5f9;">${escapeHtml(name)}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: bold; color: #475569; border-bottom: 1px solid #f1f5f9;">Sender Email:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9;"><a href="mailto:${escapeHtml(email)}" style="color: #4f46e5; text-decoration: none;">${escapeHtml(email)}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: bold; color: #475569; border-bottom: 1px solid #f1f5f9;">Subject:</td>
              <td style="padding: 10px 0; color: #0f172a; border-bottom: 1px solid #f1f5f9;">${escapeHtml(subject || 'N/A')}</td>
            </tr>
          </table>
          <div style="background-color: #f8fafc; padding: 18px; border-radius: 8px; border-left: 4px solid #4f46e5; margin-bottom: 20px;">
            <p style="margin: 0; white-space: pre-wrap; color: #1e293b; line-height: 1.6;">${escapeHtml(message)}</p>
          </div>
          <p style="font-size: 12px; color: #94a3b8; margin: 0; border-top: 1px solid #f1f5f9; padding-top: 14px;">
            Delivered directly via your custom SMTP server (<code>${smtpUser}</code>) to <code>${recipient}</code>.
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, message: 'Message sent successfully via SMTP!' })
    };
  } catch (error) {
    console.error('SMTP Delivery Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Failed to send message via SMTP: ' + (error.message || 'Unknown Server Error')
      })
    };
  }
};

function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
