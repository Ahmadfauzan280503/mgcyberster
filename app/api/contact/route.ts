import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, phone, message } = await request.json();

    // Validasi input
    if (!firstName || !lastName || !email || !phone || !message) {
      return NextResponse.json(
        { error: 'Semua field harus diisi' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Format email tidak valid' },
        { status: 400 }
      );
    }

    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_APP_PASSWORD;

    if (!emailUser || !emailPass) {
      console.error('Email credentials not configured in .env');
      return NextResponse.json(
        { error: 'Konfigurasi email belum diatur. Hubungi admin.' },
        { status: 500 }
      );
    }

    // Create transporter using Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    // Email to admin
    const mailOptions = {
      from: `"MG Cyberster Website" <${emailUser}>`,
      to: emailUser,
      replyTo: email,
      subject: `📩 Pesan Baru dari ${firstName} ${lastName} - MG Cyberster`,
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; border-radius: 20px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">
              🚗 MG Cyberster Showroom
            </h1>
            <p style="color: rgba(255,255,255,0.6); margin: 8px 0 0; font-size: 13px; text-transform: uppercase; letter-spacing: 2px;">
              Pesan Masuk Baru
            </p>
          </div>
          
          <div style="padding: 30px;">
            <div style="background: white; border-radius: 16px; padding: 24px; margin-bottom: 20px; border: 1px solid #e9ecef;">
              <h3 style="margin: 0 0 16px; color: #1a1a2e; font-size: 16px; font-weight: 700;">📋 Detail Pengirim</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #6c757d; font-size: 13px; font-weight: 600; width: 120px;">Nama</td>
                  <td style="padding: 8px 0; color: #212529; font-size: 14px; font-weight: 600;">${firstName} ${lastName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6c757d; font-size: 13px; font-weight: 600;">Email</td>
                  <td style="padding: 8px 0; color: #212529; font-size: 14px;"><a href="mailto:${email}" style="color: #3b82f6; text-decoration: none;">${email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6c757d; font-size: 13px; font-weight: 600;">Telepon</td>
                  <td style="padding: 8px 0; color: #212529; font-size: 14px;">+62 ${phone}</td>
                </tr>
              </table>
            </div>
            
            <div style="background: white; border-radius: 16px; padding: 24px; border: 1px solid #e9ecef;">
              <h3 style="margin: 0 0 12px; color: #1a1a2e; font-size: 16px; font-weight: 700;">💬 Pesan</h3>
              <p style="margin: 0; color: #495057; font-size: 14px; line-height: 1.7; white-space: pre-wrap;">${message}</p>
            </div>
          </div>
          
          <div style="padding: 20px 30px; text-align: center; border-top: 1px solid #e9ecef;">
            <p style="color: #adb5bd; font-size: 11px; margin: 0;">
              Email ini dikirim otomatis dari website MG Cyberster Showroom
            </p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      message: 'Email berhasil dikirim',
    });
  } catch (error) {
    console.error('Contact API Error:', error);
    return NextResponse.json(
      { error: 'Gagal mengirim email. Silakan coba lagi.' },
      { status: 500 }
    );
  }
}
