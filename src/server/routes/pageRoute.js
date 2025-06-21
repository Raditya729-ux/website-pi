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
router.get('/logout', logoutUser);

// Halaman Utama (harus login)
router.get('/', isUserLoggedIn, showHomePage);
router.get('/index', isUserLoggedIn, showHomePage);

// Halaman Navigasi (harus login)
router.get('/menu', isUserLoggedIn, showMenuPage);
router.get('/tentangKami', isUserLoggedIn, showTentangKamiPage);
router.get('/kontak', isUserLoggedIn, showKontak);

// Keranjang (harus login)
router.get('/keranjang', isUserLoggedIn, showKeranjang);
router.post('/keranjang/tambah', isUserLoggedIn, addToCart);
router.post('/keranjang/tambah/:id', isUserLoggedIn, tambahJumlahItem);
router.post('/keranjang/kurangi/:id', isUserLoggedIn, kurangiJumlahItem);
router.post('/keranjang/hapus/:id', isUserLoggedIn, hapusDariKeranjang);

// Checkout (harus login)
router.get('/checkout', isUserLoggedIn, showCheckoutPage);
router.post('/checkout', isUserLoggedIn, checkout);
router.post('/checkout/checkout_status', isUserLoggedIn, upload.single('bukti'), checkOutStatus);
router.get('/checkout/checkout_status', isUserLoggedIn, getCheckoutStatusPage);
// router.get('/checkout_status_partial', isUserLoggedIn, getCheckoutStatusPartial);

export default router;
