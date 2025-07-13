import express from 'express';
import {
  showRegisterPage, registerUser, showHomePage, showMenuPage,
  showTentangKamiPage, showKontak, showKeranjang, showCheckoutPage,
  addToCart, checkout, hapusDariKeranjang, tambahJumlahItem,
  kurangiJumlahItem, getCheckoutStatusPage, checkOutStatus,
  showLoginUser, loginUser, logoutUser, 
  // getCheckoutStatusPartial
} from '../controllers/pageController.js';
import { upload } from '../middlewares/paymentMiddleware.js';
import { isUserLoggedIn } from '../middlewares/isUserLoggedIn.js';
const router = express.Router();

// Login & Register
router.get('/userRegister', showRegisterPage);
router.post('/userRegister', registerUser);
router.get('/user/login', showLoginUser);
router.post('/user/login', loginUser);
router.get('/logout', isUserLoggedIn, logoutUser);

// Halaman Utama (harus login)
router.get('/', showHomePage);
router.get('/index', showHomePage);

// Halaman Navigasi (harus login)
router.get('/menu', showMenuPage);
router.get('/tentangKami', showTentangKamiPage);
router.get('/kontak', showKontak);

// Keranjang (harus login)
router.get('/keranjang', showKeranjang);
router.post('/keranjang/tambah', addToCart);
router.post('/keranjang/tambah/:id', tambahJumlahItem);
router.post('/keranjang/kurangi/:id', kurangiJumlahItem);
router.post('/keranjang/hapus/:id', hapusDariKeranjang);

// Checkout (harus login)
router.get('/checkout', isUserLoggedIn, showCheckoutPage);
router.post('/checkout', isUserLoggedIn, checkout);
router.post('/checkout/checkout_status', isUserLoggedIn, upload.single('bukti'), checkOutStatus);
router.get('/checkout/checkout_status', isUserLoggedIn, getCheckoutStatusPage);

export default router;
// // import express from 'express';
// // import {
// //   showRegisterPage, registerUser, showHomePage, showMenuPage,
// //   showTentangKamiPage, showKontak, showKeranjang, showCheckoutPage,
// //   addToCart, checkout, hapusDariKeranjang, tambahJumlahItem,
// //   kurangiJumlahItem, getCheckoutStatusPage, checkOutStatus,
// //   showLoginUser, loginUser, logoutUser, 
// //   // checkLoginStatus, mergeCartFromLocal
// //   // getCheckoutStatusPartial
// // } from '../controllers/pageController.js';
// // import { upload } from '../middlewares/paymentMiddleware.js';
// // import { isUserLoggedIn } from '../middlewares/isUserLoggedIn.js';

// // const router = express.Router();


// // Halaman Utama (harus login)
// router.get('/', showHomePage);
// router.get('/index', showHomePage);

// // Halaman Navigasi (harus login)
// router.get('/menu', showMenuPage);
// router.get('/tentangKami', showTentangKamiPage);
// router.get('/kontak', showKontak);

// // Login & Register
// router.get('/userRegister', showRegisterPage);
// router.post('/userRegister', registerUser);
// // //HAPUS
// // router.get('/check-login', checkLoginStatus);

// router.get('/user/login', showLoginUser);
// router.post('/user/login', loginUser);
// router.get('/logout', isUserLoggedIn, logoutUser);//REVISI DWIKI
// // router.get('/logout', logoutUser);

// // Halaman Utama (harus login)
// // router.get('/', isUserLoggedIn, showHomePage);
// // router.get('/index', isUserLoggedIn, showHomePage);

// // Halaman Navigasi (harus login)
// // router.get('/menu', isUserLoggedIn, showMenuPage);
// // router.get('/tentangKami', isUserLoggedIn, showTentangKamiPage);
// // router.get('/kontak', isUserLoggedIn, showKontak);

// //Keranjang (harus login)
// //HAPUS
// // router.post('/merge-cart', express.json(), mergeCartFromLocal);

// router.get('/keranjang', showKeranjang);
// router.post('/keranjang/tambah', isUserLoggedIn, addToCart);
// router.post('/keranjang/tambah/:id', isUserLoggedIn, tambahJumlahItem);
// router.post('/keranjang/kurangi/:id', isUserLoggedIn, kurangiJumlahItem);
// router.post('/keranjang/hapus/:id', isUserLoggedIn, hapusDariKeranjang);

// // Keranjang (harus login)
// // router.get('/keranjang', isUserLoggedIn, showKeranjang);
// // router.post('/keranjang/tambah', isUserLoggedIn, addToCart);
// // router.post('/keranjang/tambah/:id', isUserLoggedIn, tambahJumlahItem);
// // router.post('/keranjang/kurangi/:id', isUserLoggedIn, kurangiJumlahItem);
// // router.post('/keranjang/hapus/:id', isUserLoggedIn, hapusDariKeranjang);

// // Checkout (harus login)
// router.get('/checkout', isUserLoggedIn, showCheckoutPage);
// router.post('/checkout', isUserLoggedIn, checkout);
// router.post('/checkout/checkout_status', isUserLoggedIn, upload.single('bukti'), checkOutStatus);
// router.get('/checkout/checkout_status', isUserLoggedIn, getCheckoutStatusPage);
// // router.get('/checkout_status_partial', isUserLoggedIn, getCheckoutStatusPartial);

// export default router;
