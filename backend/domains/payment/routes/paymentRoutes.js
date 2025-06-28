const express = require('express');
const PaymentController = require('../controllers/PaymentController');

const router = express.Router();
const paymentController = new PaymentController();

// 결제 생성
router.post('/', (req, res, next) => paymentController.createPayment(req, res, next));

// 결제 처리
router.post('/:id/process', (req, res, next) => paymentController.processPayment(req, res, next));

// 결제 조회
router.get('/:id', (req, res, next) => paymentController.getPaymentById(req, res, next));

// 사용자 결제 내역 조회
router.get('/user/:userId', (req, res, next) => paymentController.getUserPayments(req, res, next));

// 환불 처리
router.post('/:id/refund', (req, res, next) => paymentController.refundPayment(req, res, next));

module.exports = router;