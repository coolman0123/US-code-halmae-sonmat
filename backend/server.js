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
    secure: process.env.NODE_ENV === 'production', // 프로덕션에서는 HTTPS 필요
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24시간
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax' // 크로스 도메인 쿠키 허용
  }
}));

app.use(express.json());

// 헬스체크 엔드포인트
app.get('/health', (req, res) => {
  console.log('🏥 헬스체크 요청');
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: '서버가 정상적으로 작동 중입니다.'
  });
});

// API 요청 로깅 미들웨어
app.use('/api', (req, res, next) => {
  console.log('📡 API 요청:', {
    method: req.method,
    url: req.url,
    headers: req.headers,
    body: req.body,
    timestamp: new Date().toISOString()
  });
  next();
});

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
