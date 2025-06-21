import nodemailer from 'nodemailer';

export const sendInvoiceEmail = async (toEmail, filePath) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'raditardi06@gmail.com', // Ganti dengan email kamu
            pass: 'hmco notc danz tyzc'      // Gunakan App Password dari Google
        }
    });

    const mailOptions = {
        from: 'raditardi06@gmail.com',
        to: toEmail,
        subject: 'Invoice Pemesanan Anda',
        text: 'Terima kasih telah memesan. Berikut adalah invoice Anda dalam bentuk PDF.',
        attachments: [
            {
                filename: 'invoice.pdf',
                path: filePath
            }
        ]
    };

    await transporter.sendMail(mailOptions);
};
