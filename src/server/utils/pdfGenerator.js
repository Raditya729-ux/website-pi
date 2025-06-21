import PDFDocument from 'pdfkit';
import fs from 'fs';

export const generateInvoicePDF = (data, filePath) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    doc.fontSize(20).text('Invoice Pemesanan', { align: 'center' });
    doc.moveDown();

    doc.fontSize(12).text(`Nama     : ${data.nama}`);
    doc.text(`Email     : ${data.email}`);
    doc.text(`Telepon   : ${data.telepon}`);
    doc.text(`Alamat    : ${data.alamat}`);
    doc.text(`Tanggal   : ${new Date().toLocaleString()}`);
    doc.moveDown();
    doc.text(`Total     : Rp ${data.total}`);
    doc.text(`DP        : Rp ${data.dp}`);
    doc.text(`Sisa Bayar: Rp ${data.sisa}`);

    doc.end();

    stream.on('finish', resolve);
    stream.on('error', reject);
  });
};
