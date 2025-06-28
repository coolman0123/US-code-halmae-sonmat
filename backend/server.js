const express = require('express');
const cors = require('cors');
const session = require('express-session');
const swaggerUi = require('swagger-ui-express');
const specs = require('./config/swagger/swagger');
const userRoutes = require('./routes/userRoutes');

const hostRoutes = require('./domains/host/routes/hostRoutes');
const authRoutes = require('./domains/auth/routes/authRoutes');

const tripRoutes = require('./domains/trip/routes/tripRoutes');
const reviewRoutes = require('./domains/review/routes/reviewRoutes');
const paymentRoutes = require('./domains/payment/routes/paymentRoutes');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173', 'https://us-code-halmae-sonmat-hev09y1qr-coolman0123s-projects.vercel.app'],
  credentials: true
}));

// 세션 설정
app.use(session({
  secret: process.env.SESSION_SECRET || 'grandma-hand-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // HTTPS 환경에서는 true로 설정
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24시간
  }
}));

app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/hosts', hostRoutes);

app.use('/api/trips', tripRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/payments', paymentRoutes);


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));
app.use((err, req, res, next) => {
  res.status(500).json({ success: false, message: err.message });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
