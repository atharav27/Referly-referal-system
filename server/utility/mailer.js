// import nodemailer from 'nodemailer';

// const transporter = nodemailer.createTransport({
//   service: 'gmail', // Or use another email service like SendGrid, Mailgun
//   auth: {
//     user: process.env.EMAIL_USER,  // Your email address
//     pass: process.env.EMAIL_PASSWORD, // Your email password
//   },
// });

// export const sendOTP = async (toEmail, otp) => {
//   try {
//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: toEmail,
//       subject: 'Your OTP for Email Verification',
//       text: `Your OTP for email verification is: ${otp}`,
//     };

//     await transporter.sendMail(mailOptions);
//     console.log('OTP sent successfully');
//   } catch (error) {
//     console.error('Error sending OTP:', error);
//     throw new Error('Error sending OTP');
//   }
// };
