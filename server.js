import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import adminRoute from './src/server/routes/adminRoute.js';
// import { loginAdmin } from './controllers/adminController.js';
import publicRoute from './src/server/routes/pageRoute.js';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.set('views', path.join(__dirname, 'src/server/views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'src/client/public')));
app.use('/uploads', express.static(path.join(__dirname, 'src/client/public/uploads')));
app.use('/buktiPembayaran', express.static(path.join(__dirname, 'src/client/public/buktiPembayaran')));

// app.use('/uploads', express.static('src/client/public/uploads'));
// app.use('/buktiPembayaran', express.static('src/client/public/buktiPembayaran'));

app.use(session({
  secret: 'secretAdminKey',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 2, // 1 jam
  }
}));

// Set userData global ke EJS
app.use((req, res, next) => {
  res.locals.userData = req.session.userData || null;
  next();
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use('/', publicRoute);
app.use('/', adminRoute);
// app.post('/login', loginAdmin);

io.on('connection', (socket) => {
  console.log('User connected');
});

httpServer.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
