import bcrypt from 'bcrypt';
import db from '../config/db.js';

// TAMPILKAN HALAMAN REGISTER ADMIN
// export const showRegisterPage = (req, res) => {
//   res.render('adminRegister', { error: null });
// };

// // PROSES REGISTRASI ADMIN
// export const registerAdmin = async (req, res) => {
//   // const { email, password } = req.body;
//   const email = req.body.email.trim();
//   const password = req.body.password;

//   // console.log('Email input:', `"${email}"`); // <- ini ditambah
//   // console.log('Password input:', `"${password}"`); // <- ini juga bisa bantu debugging

//   if (!email || !password) {
//     return res.render('adminRegister', { error: 'Email dan password wajib diisi' });
//   }

//   db.query('SELECT * FROM admins WHERE email = ?', [email], async (err, results) => {
//     if (err) {
//       console.error(err);
//       return res.render('adminRegister', { error: 'Terjadi kesalahan' });
//     }

//     if (results.length > 0) {
//       return res.render('adminRegister', { error: 'Email sudah terdaftar' });
//     }

//     try {
//       const hash = await bcrypt.hash(password, 10);
//       db.query('INSERT INTO admins (email, password) VALUES (?, ?)', [email, hash], (err2) => {
//         if (err2) {
//           console.error(err2);
//           return res.render('adminRegister', { error: 'Gagal mendaftarkan admin' });
//         }

//         res.redirect('/admin/login');
//       });
//     } catch (error) {
//       console.error('Error hashing password:', error);
//       res.render('adminRegister', { error: 'Terjadi kesalahan saat proses' });
//     }
//   });
// };

// TAMPILKAN HALAMAN LOGIN ADMIN
export const showLoginPage = (req, res) => {
  res.render('adminLogin', { error: null });
};

// PROSES LOGIN ADMIN
export const loginAdmin = (req, res) => {
  const email = req.body.email.trim();
  const password = req.body.password;

  //  console.log('Email input:', email);

  db.query('SELECT * FROM admins WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.error('Query error:', err);
      return res.render('adminLogin', { error: 'Terjadi kesalahan saat login' });
    }

    console.log('Hasil query:', results); // <- tambahkan ini juga

    if (results.length === 0) {
      console.log('Email tidak ditemukan di DB:', email);
      return res.render('adminLogin', { error: 'Email tidak ditemukan' });
    }


    const admin = results[0];

    (async () => {
      const isMatch = await bcrypt.compare(password, admin.password);

      if (!isMatch) {
        return res.render('adminLogin', { error: 'Password salah' });
      }

      req.session.isAdmin = true;
      res.redirect('/adminDashboard');
    })();
  });
};

// LOGOUT
export const logoutAdmin = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/admin/login');
  });
};

// TAMPILKAN HALAMAN TRANSAKSI
export const showTransaksiPage = (req, res) => {
  const transaksiQuery = `
    SELECT 
      p.id AS invoice_id,
      p.nama AS pembeli,
      p.email,
      p.telepon,
      p.alamat,
      p.tanggal,
      bayar.status,
      bayar.bukti_transfer,
      m.nama AS nama_menu,
      m.harga,
      dp.qty
    FROM pesanan p
    JOIN pembayaran bayar ON p.id = bayar.pesanan_id
    JOIN detail_pesanan dp ON p.id = dp.pesanan_id
    JOIN menu m ON dp.menu_id = m.id
    ORDER BY p.tanggal DESC
  `;

  db.query(transaksiQuery, (err, results) => {
    if (err) return res.status(500).send('Gagal ambil transaksi');

    const groupedTransaksi = {};

    results.forEach(row => {
      if (!groupedTransaksi[row.invoice_id]) {
        groupedTransaksi[row.invoice_id] = {
          invoice_id: row.invoice_id,
          nama_pembeli: row.pembeli,
          email: row.email,
          telepon: row.telepon,
          alamat: row.alamat,
          tanggal: row.tanggal,
          status: row.status,
          bukti: row.bukti_transfer,
          menu: []
        };
      }

      groupedTransaksi[row.invoice_id].menu.push({
        nama: row.nama_menu,
        harga: row.harga,
        jumlah: row.qty
      });
    });

    const transaksiList = Object.values(groupedTransaksi);

    res.render('adminDashboard', {
      currentPage: 'transaksi',
      menuList: [],
      transaksiList,
      selectedMenu: null
    });
  });
};

// TAMPILKAN HALAMAN MENU
export const showMenuPage = (req, res) => {
  db.query('SELECT * FROM menu WHERE is_deleted = 0', (err, menuResults) => {
    if (err) return res.status(500).send('Gagal ambil menu');

    const editId = req.query.edit;
    let selectedMenu = null;

    if (editId) {
      selectedMenu = menuResults.find(menu => menu.id == editId);
    }

    res.render('adminDashboard', {
      currentPage: 'menu',
      menuList: menuResults,
      transaksiList: [],
      selectedMenu
    });
  });
};

// DASHBOARD ADMIN
export const showAdminPage = (req, res) => {
  const section = req.query.section || 'transaksi' || 'menu';
  const transaksiQuery = `
    SELECT 
      p.id AS invoice_id,
      p.nama AS pembeli,
      p.email,
      p.telepon,
      p.alamat,
      p.tanggal,
      bayar.status,
      bayar.bukti_transfer,
      m.nama AS nama_menu,
      m.harga,
      dp.qty
    FROM pesanan p
    JOIN pembayaran bayar ON p.id = bayar.pesanan_id
    JOIN detail_pesanan dp ON p.id = dp.pesanan_id
    JOIN menu m ON dp.menu_id = m.id
    ORDER BY p.tanggal DESC
  `;

  db.query('SELECT * FROM menu WHERE is_deleted = 0', (err, menuResults) => {
    if (err) return res.status(500).send('Gagal ambil menu');

    db.query(transaksiQuery, (err2, results) => {
      if (err2) return res.status(500).send('Gagal ambil transaksi');

      const groupedTransaksi = {};

      results.forEach(row => {
        if (!groupedTransaksi[row.invoice_id]) {
          groupedTransaksi[row.invoice_id] = {
            invoice_id: row.invoice_id,
            nama_pembeli: row.pembeli,
            email: row.email,
            telepon: row.telepon,
            alamat: row.alamat,
            tanggal: row.tanggal,
            status: row.status,
            bukti: row.bukti_transfer,
            menu: []
          };
        }

        groupedTransaksi[row.invoice_id].menu.push({
          nama: row.nama_menu,
          harga: row.harga,
          jumlah: row.qty
        });
      });

      const transaksiList = Object.values(groupedTransaksi);

      const editId = req.query.edit;
      let selectedMenu = null;
      if (editId) {
        selectedMenu = menuResults.find(menu => menu.id == editId);
      }

      res.render('adminDashboard', {
        currentPage: section,
        menuList: menuResults,
        transaksiList,
        selectedMenu
      });
    });
  });
};

// UPLOAD MENU
export const uploadMenu = (req, res) => {
  const { nama, harga, deskripsi } = req.body;
  const image = req.file?.filename;

  if (!nama || !harga || !deskripsi || isNaN(parseInt(harga))) {
    return res.status(400).send('Input tidak valid');
  }

  db.query('INSERT INTO menu (nama, harga, deskripsi, image) VALUES (?, ?, ?, ?)', [nama, harga, deskripsi, image], (err) => {
    if (err) {
      console.error('Gagal upload menu:', err);
      return res.status(500).send('Gagal upload menu');
    }
    res.redirect('/adminDashboard');
  });
};

// FORM EDIT
export const getEditForm = (req, res) => {
  const { id } = req.params;
  res.redirect(`/adminDashboard?edit=${id}`);
};

// EDIT MENU
export const editMenu = (req, res) => {
  const { id } = req.params;
  const { nama, harga, deskripsi } = req.body;
  const image = req.file ? req.file.filename : null;

  let query = 'UPDATE menu SET nama = ?, harga = ?, deskripsi = ?';
  let params = [nama, harga, deskripsi];

  if (image) {
    query += ', image = ?';
    params.push(image);
  }

  query += ' WHERE id = ?';
  params.push(id);

  db.query(query, params, (err) => {
    if (err) {
      console.error('Gagal edit menu:', err);
      return res.status(500).send('Gagal mengedit menu');
    }
    res.redirect('/adminDashboard');
  });
};

// DELETE MENU (Soft Delete)
export const deleteMenu = (req, res) => {
  const { id } = req.params;
  const query = 'UPDATE menu SET is_deleted = 1 WHERE id = ?';

  db.query(query, [id], (err) => {
    if (err) {
      console.error('Gagal menghapus menu:', err);
      return res.status(500).send('Gagal menghapus menu');
    }
    res.redirect('/adminDashboard');
  });
};

export const getCheckoutStatusPage = (req, res) => {
  const email = req.session.userData?.email;

  db.query(
    `SELECT bayar.status FROM pesanan p
     JOIN pembayaran bayar ON p.id = bayar.pesanan_id
     WHERE p.email = ?
     ORDER BY p.tanggal DESC LIMIT 1`,
    [email],
    (err, results) => {
      if (err || results.length === 0) {
        return res.render('checkout_status', { status: 'unknown' });
      }

      res.render('checkout_status', { status: results[0].status });
    }
  );
};

export const ubahStatus = (req, res) => {
  const pesananId = req.params.id;
  const toStatus = req.query.to;

  if (!['menunggu', 'diproses', 'diantar', 'sampai'].includes(toStatus)) {
    return res.status(400).send('Status tidak valid');
  }

  // Ambil email user berdasarkan pesananId
  db.query(`SELECT email FROM pesanan WHERE id = ?`, [pesananId], (err, result) => {
    if (err || result.length === 0) {
      console.error('Gagal mengambil email untuk emit:', err || 'Data tidak ditemukan');
      return res.status(500).send('Gagal mengambil data email');
    }

    const userEmail = result[0].email;

    // Update status pembayaran setelah mendapatkan email
    db.query(
      'UPDATE pembayaran SET status = ? WHERE pesanan_id = ?',
      [toStatus, pesananId],
      (err) => {
        if (err) {
          console.error('Gagal update status :', err.message);
          return res.status(500).send('Gagal update status');
        }

        // Emit event ke semua client setelah update sukses
        req.io.emit('statusUpdated', {
          pesananId,
          newStatus: toStatus,
          userEmail
        });

        res.redirect('/adminDashboard');
      }
    );
  });
};



