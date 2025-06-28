const PaymentService = require('../services/PaymentService');

class PaymentController {
  constructor() {
    this.paymentService = new PaymentService();
  }

  async getAllPayments(req, res, next) {
    try {
      const payments = await this.paymentService.getAllPayments();
      res.status(200).json({
        success: true,
        data: payments
      });
    } catch (error) {
      next(error);
    }
  }

  async createPayment(req, res, next) {
    try {
      const payment = await this.paymentService.createPayment(req.body);
      res.status(201).json({
        success: true,
        message: '결제 정보가 생성되었습니다.',
        data: payment
      });
    } catch (error) {
      next(error);
    }
  }

  async processPayment(req, res, next) {
    try {
      const { id } = req.params;
      const payment = await this.paymentService.processPayment(id);
      res.status(200).json({
        success: true,
        message: '결제가 완료되었습니다.',
        data: payment
      });
    } catch (error) {
      next(error);
    }
  }

  async getPaymentById(req, res, next) {
    try {
      const { id } = req.params;
      const payment = await this.paymentService.getPaymentById(id);
      res.status(200).json({
        success: true,
        data: payment
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserPayments(req, res, next) {
    try {
      const { userId } = req.params;
      const payments = await this.paymentService.getUserPayments(userId);
      res.status(200).json({
        success: true,
        data: payments
      });
    } catch (error) {
      next(error);
    }
  }

  async refundPayment(req, res, next) {
    try {
      const { id } = req.params;
      const payment = await this.paymentService.refundPayment(id);
      res.status(200).json({
        success: true,
        message: '환불이 완료되었습니다.',
        data: payment
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = PaymentController;