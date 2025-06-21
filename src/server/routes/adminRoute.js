import express from 'express';
import upload from '../middlewares/uploadMiddleware.js';
import {
  showAdminPage,
  showTransaksiPage, 
  showMenuPage,
  uploadMenu,
  editMenu,
  deleteMenu,
  showLoginPage,
  loginAdmin,
  logoutAdmin,
  getEditForm,
  // showRegisterPage,
  // registerAdmin,
  // updateStatusPesanan,
  ubahStatus
} from '../controllers/adminController.js';

import { isAdminLoggedIn } from '../middlewares/isAdmin.js';

const router = express.Router();

// REGISTER ADMIN
// router.get('/admin/register', showRegisterPage);
// router.post('/admin/register', registerAdmin);

// LOGIN & LOGOUT
router.get('/admin/login', showLoginPage);  
router.post('/admin/login', loginAdmin);
router.get('/admin/logout', logoutAdmin);

// DASHBOARD & CRUD
router.get('/adminDashboard', isAdminLoggedIn, showAdminPage);
router.get('/adminDashboard/transaksi', isAdminLoggedIn, showTransaksiPage);
router.get('/adminDashboard/menu', isAdminLoggedIn, showMenuPage);
router.post('/adminDashboard/upload', isAdminLoggedIn, upload.single('image'), uploadMenu);
router.get('/adminDashboard/edit/:id', isAdminLoggedIn, getEditForm);
router.post('/adminDashboard/edit/:id', isAdminLoggedIn, upload.single('image'), editMenu);
router.get('/adminDashboard/delete/:id', isAdminLoggedIn, deleteMenu);
router.post('/admin/ubah_status/:id', ubahStatus);


export default router;


