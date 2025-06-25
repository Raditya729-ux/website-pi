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
// router.get('/checkout_status_partial', isUserLoggedIn, getCheckoutStatusPartial);

export default router;
