
import path from 'path';
import bcrypt from 'bcrypt';
import db from '../config/db.js';
import { generateInvoicePDF } from '../utils/pdfGenerator.js';
import { sendInvoiceEmail } from '../utils/emailSender.js';


// REGISTER USER
export const showRegisterPage = (req, res) => {
  const referal = req.query.ref; //REVISI DWIKI
  res.render('userRegister', { error: null, referal }); //REVISI DWIKI

  // res.render('userRegister', { error: null });
};

export const registerUser = (req, res) => {
  const { nama, email, telepon, password } = req.body;
  const referal = req.query.ref; //REVISI DWIKI

  db.query('SELECT * FROM users WHERE email_user= ?', [email], async (err, results) => {
    if (err) {
      console.error('Error saat mengecek email:', err);
      return res.render('userRegister', { error: 'Terjadi kesalahan saat proses', referal });
    }

    if (results.length > 0) {
      return res.render('userRegister', { error: 'Email sudah terdaftar', referal });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      'INSERT INTO users (nama_user, email_user, telepon_user, password_user) VALUES (?, ?, ?, ?)',
      [nama, email, telepon, hashedPassword],
      (err2, result) => {
        if (err2) {
          console.error('Gagal menyimpan user:', err2);
          return res.render('userRegister', { error: 'Gagal menyimpan data user' });
        }
        res.redirect('/user/login');
      }
    );
  });
};

// TAMPILKAN HALAMAN LOGIN USER
export const showLoginUser = (req, res) => {
  const referal = req.query.ref; //REVISI DWIKI
  res.render('userLogin', { error: null, referal });//REVISI DWIKI

  // res.render('userLogin', { error: null });
};

export const loginUser = (req, res) => {
  const { email, password } = req.body;
  const referal = req.query.ref; //REVISI DWIKI
  db.query('SELECT * FROM users WHERE email_user = ?', [email], async (err, results) => {
    if (err) {
      console.error('Error saat login:', err);
      return res.render('userLogin', { error: 'Terjadi kesalahan', referal });
    }
    if (results.length === 0) {
      return res.render('userLogin', { error: 'Email tidak ditemukan', referal });
    }
    const user = results[0];

    console.log('Password dari form:', password);
    console.log('Hash di database:', user.password);

    const isMatch = await bcrypt.compare(password, user.password_user);

    console.log('Hasil compare bcrypt:', isMatch);
    if (!isMatch) {
      return res.render('userLogin', { error: 'Password salah', referal });
    }
    req.session.isUser = true;
    req.session.userData = {
      id_user: user.id_user,
      nama_user: user.nama_user,
      email_user: user.email_user,
      telepon_user: user.telepon_user
    };
    res.redirect(referal || '/');//REVISI DWIKI
    // res.redirect('/');
  });
};

//LOGOUT USER
export const logoutUser = (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.redirect('/');//REVISI DWIKI
    // res.redirect('/user/login');
  });
};

// HOME PAGE
export const showHomePage = (req, res) => {
  db.query('SELECT * FROM menu WHERE is_deleted = 0', (err, results) => {
    if (err) {
      console.error('Error mengambil menu:', err);
      return res.status(500).send('Gagal mengambil data menu');
    }
    res.render('index', {
      currentPage: '/',
      menuList: results,
      isLoggedIn: req.session && req.session.isUser//REVISI DWIKI
    });
  });
};

// MENU PAGE
export const showMenuPage = (req, res) => {
  db.query('SELECT * FROM menu', (err, results) => {
    if (err) {
      console.error('Gagal mengambil data menu:', err);
      return res.status(500).send('Gagal mengambil data menu');
    }
    const cart = req.session.cart || [];
    res.render('menu', {
      currentPage: 'menu',
      menuList: results
    });
  });
};

// TENTANG KAMI
export const showTentangKamiPage = (req, res) => {
  res.render('tentangKami', { currentPage: 'tentangKami' });
};

// KONTAK
export const showKontak = (req, res) => {
  res.render('kontak', { currentPage: 'kontak' });
};

// KERANJANG
export const showKeranjang = (req, res) => {
  const cart = req.session.cart || [];
  const totalHarga = cart.reduce((total, item) => total + item.harga_menu * item.jumlah, 0);
  const user = req.session.userData || {};
  const checkoutTemp = req.session.checkoutTemp || {
    nama: user.nama_user || '',
    email: user.email_user || '',
    telepon: user.telepon_user || '',
    alamat: ''
  };

  res.render('keranjang', { currentPage: 'keranjang', isLoggedIn: req.session && req.session.isUser, cart, totalHarga, user, checkoutTemp });//REVISI DWIKI

  // res.render('keranjang', { currentPage: 'keranjang', cart, totalHarga, user });
};

export const addToCart = (req, res) => {
  const { id, nama, harga, image, jumlah } = req.body;
  const parsedId = parseInt(id);
  const parsedJumlah = parseInt(jumlah);

  if (!parsedId || isNaN(parsedId)) {
    console.error('Invalid ID from form');
    return res.redirect('/keranjang');
  }

  const cart = req.session.cart || [];

  const existing = cart.find(item => item.id === parsedId);
  if (existing) {
    existing.jumlah += parsedJumlah;
  } else {
    cart.push({
      id_menu: parsedId,
      nama_menu: nama,
      harga_menu: parseInt(harga),
      image,
      jumlah: parsedJumlah
    });
  }

  req.session.cart = cart;
  res.redirect('/keranjang');
};

export const tambahJumlahItem = (req, res) => {
  const itemId = parseInt(req.params.id);
  const cart = req.session.cart || [];
  const item = cart.find(item => item.id_menu === itemId);
  if (item) {
    item.jumlah += 1;
  }
  req.session.cart = cart;
  res.redirect('/keranjang');
};

export const kurangiJumlahItem = (req, res) => {
  const itemId = parseInt(req.params.id);
  let cart = req.session.cart || [];
  const item = cart.find(item => item.id_menu === itemId);
  if (item) {
    item.jumlah -= 1;
    if (item.jumlah <= 0) {
      cart = cart.filter(i => i.id_menu !== itemId);
    }
  }
  req.session.cart = cart;
  res.redirect('/keranjang');
};

export const hapusDariKeranjang = (req, res) => {
  const itemId = parseInt(req.params.id);
  let cart = req.session.cart || [];
  cart = cart.filter(item => item.id !== itemId);
  req.session.cart = cart;
  res.redirect('/keranjang');
};

// CHECKOUT
export const checkout = async (req, res) => {
  const cart = req.session.cart || [];
  const { nama, email, telepon, alamat } = req.body;
  req.session.checkoutTemp = { nama, email, telepon, alamat };

  const { id } = req.session.userData;
  if (cart.length === 0) return res.send('Keranjang kosong.');

  const total = cart.reduce((total, item) => total + item.harga_menu * item.jumlah, 0);
  const dp = Math.round(total * 0.5);
  const sisa = total - dp;

  db.query(
    `UPDATE users SET nama_user = ?, email_user = ?, telepon_user = ? WHERE id_user = ?`,
    [nama, email, telepon, id],
    (err) => {
      if (err) {
        console.error('Gagal update data user:', err.message);
      }
    }
  );

  // Update session userData biar sinkron
  req.session.userData = { id, nama, email, telepon };
  req.session.user = { nama, email, telepon, alamat };

  db.query(

    'INSERT INTO pesanan (tanggal, total_pesanan, nama, email, telepon, alamat) VALUES (NOW(), ?, ?, ?, ?, ?)',
    [total, nama, email, telepon, alamat],
    (err, result) => {
      if (err) {
        console.error('Gagal menyimpan pesanan:', err);
        return res.status(500).send('Gagal menyimpan pesanan.');
      }

      const pesananId = result.insertId;
      const detailValues = cart.map(item => [
        pesananId, item.id_menu, item.harga_menu, item.jumlah, item.harga_menu * item.jumlah
      ]);

      console.log('Detail values akan dimasukkan:', detailValues);

      db.query(
        'INSERT INTO detail_pesanan (pesanan_id, menu_id, harga_detail_pesanan, kuantitas, subtotal) VALUES ?',
        [detailValues],
        async (err2) => {
          if (err2) {
            console.error('Gagal menyimpan detail pesanan:', err2);
            return res.status(500).send('Gagal menyimpan detail pesanan.');
          }

          db.query(
            `INSERT INTO pembayaran (pesanan_id, jumlah_total, jumlah_dp, sisa_bayar, status, created_at)
             VALUES (?, ?, ?, ?, 'menunggu', NOW())`,
            [pesananId, total, dp, sisa],
            async (err3) => {
              if (err3) {
                console.error('Gagal menyimpan pembayaran:', err3.message);
                return res.status(500).send('Gagal menyimpan data pembayaran.');
              }

              // try {
              //   const filePath = path.join('src/client/public/uploads', `invoice_${pesananId}.pdf`);
              //   await generateInvoicePDF({ nama, email, telepon, alamat, total, dp, sisa }, filePath);
              //   await sendInvoiceEmail(email, filePath);
              // } catch (pdfEmailError) {
              //   console.error('Gagal generate/kirim email invoice:', pdfEmailError.message);
              // }

              req.session.checkoutData = { pesananId, total, dp, sisa };
              // req.session.cart = [];
              res.redirect('/checkout');
            }
          );
        }
      );
    }
  );
};

export const showCheckoutPage = (req, res) => {
  const data = req.session.checkoutData;
  if (!data) return res.redirect('/keranjang');
  res.render('checkout', {
    pesananId: data.pesananId,
    total: data.total,
    dp: data.dp,
    sisa: data.sisa,
    user: req.session.user || {}
  });
  // req.session.checkoutData = null;
};


export const getCheckoutStatusPage = (req, res) => {
  const email = req.session.userData?.email || req.session.user?.email;

  console.log('Session email:', email);
  if (!email) {
    return res.render('checkout_status', { status: 'unknown' });
  }

  const sql = `
    SELECT bayar.status FROM pesanan p
    JOIN pembayaran bayar ON p.id_pesanan = bayar.pesanan_id
    WHERE p.email = ? AND bayar.status IS NOT NULL
    ORDER BY p.tanggal DESC
    LIMIT 1
  `;

  db.query(sql, [email], (err, results) => {
    if (err) {
      console.error('Query error:', err);
      return res.render('checkout_status', { status: 'unknown', userEmail: email });
    }

    console.log('Query results:', results);

    if (results.length === 0) {
      return res.render('checkout_status', { status: 'unknown', userEmail: email });
    }

    const status = (results[0].status || '').trim().toLowerCase();
    res.render('checkout_status', {
      status,
      userEmail: req.session.user.email
    });
  });
};

export const checkOutStatus = async (req, res) => {
  const { pesananId } = req.body;
  const buktiPath = req.file ? `/buktiPembayaran/${req.file.filename}` : null;

  if (!buktiPath || !pesananId) {
    return res.status(400).send('Data tidak lengkap');
  }

  db.query(
    `UPDATE pembayaran SET bukti_transfer_pembayaran = ?, status = 'verifikasi' WHERE pesanan_id = ?`,
    [buktiPath, pesananId],
    async (err) => {
      if (err) {
        console.error('Gagal update pembayaran:', err.message);
        return res.status(500).send('Gagal memperbarui status pembayaran.');
      }

      // ✅ Ambil data user & pesanan
      db.query(
        `SELECT p.nama, p.email, p.telepon, p.alamat, p.total_pesanan, b.jumlah_dp, b.sisa_bayar 
         FROM pesanan p
         JOIN pembayaran b ON p.id_pesanan = b.pesanan_id
         WHERE p.id_pesanan = ?`,
        [pesananId],
        async (err2, results) => {
          if (err2) {
            console.error('Gagal mengambil data untuk invoice:', err2.message);
            return res.status(500).send('Gagal mengambil data untuk invoice.');
          }

          if (results.length === 0) {
            return res.status(404).send('Data pesanan tidak ditemukan.');
          }

          const { nama, email, telepon, alamat, total_pesanan, jumlah_dp, sisa_bayar } = results[0];
          const filePath = path.join('src/client/public/uploads', `invoice_${pesananId}.pdf`);

          try {
            await generateInvoicePDF({
              nama,
              email,
              telepon,
              alamat,
              total: total_pesanan,
              dp: jumlah_dp,
              sisa: sisa_bayar
            }, filePath);

            await sendInvoiceEmail(email, filePath);
          } catch (pdfEmailError) {
            console.error('Gagal membuat/kirim invoice:', pdfEmailError.message);
          }

          req.session.checkoutData = {
            ...req.session.checkoutData,
            status: 'verifikasi'
          };

          res.redirect('/checkout/checkout_status');
        }
      );
    }
  );
};

// export const checkOutStatus = (req, res) => {
//   const { pesananId } = req.body;
//   const buktiPath = req.file ? `/buktiPembayaran/${req.file.filename}` : null;
//   if (!buktiPath || !pesananId) {
//     return res.status(400).send('Data tidak lengkap');
//   }
//   db.query(
//     `UPDATE pembayaran SET bukti_transfer_pembayaran = ?, status = 'verifikasi' WHERE pesanan_id = ?`,
//     [buktiPath, pesananId],
//     (err) => {
//       if (err) {
//         console.error('Gagal update pembayaran:', err.message);
//         return res.status(500).send('Gagal memperbarui status pembayaran.');
//       }
//       req.session.checkoutData = {
//         ...req.session.checkoutData,
//         status: 'verifikasi'
//       };
//       res.redirect('/checkout/checkout_status');
//     }
//   );
// };




