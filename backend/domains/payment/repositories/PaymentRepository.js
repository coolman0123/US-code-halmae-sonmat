const FirebaseRepository = require('../../../firebase/FirebaseRepository');
const Payment = require('../entities/Payment');

class PaymentRepository extends FirebaseRepository {
  constructor() {
    super('payments');
  }

  async create(paymentData) {
    try {
      const payment = new Payment(paymentData);
      const docRef = await this.collection.add(payment.toJSON());
      return { id: docRef.id, ...payment.toJSON() };
    } catch (error) {
      throw new Error(`결제 생성 중 오류가 발생했습니다: ${error.message}`);
    }
  }

  async findById(id) {
    try {
      const doc = await this.collection.doc(id).get();
      if (!doc.exists) {
        return null;
      }
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      throw new Error(`결제 조회 중 오류가 발생했습니다: ${error.message}`);
    }
  }

  async findByUserId(userId) {
    try {
      const snapshot = await this.collection.where('userId', '==', userId).get();
      const payments = [];
      snapshot.forEach(doc => {
        payments.push({ id: doc.id, ...doc.data() });
      });
      return payments;
    } catch (error) {
      throw new Error(`사용자 결제 내역 조회 중 오류가 발생했습니다: ${error.message}`);
    }
  }

  async findByTripId(tripId) {
    try {
      const snapshot = await this.collection.where('tripId', '==', tripId).get();
      const payments = [];
      snapshot.forEach(doc => {
        payments.push({ id: doc.id, ...doc.data() });
      });
      return payments;
    } catch (error) {
      throw new Error(`여행 결제 내역 조회 중 오류가 발생했습니다: ${error.message}`);
    }
  }

  async update(id, updateData) {
    try {
      updateData.updatedAt = new Date();
      await this.collection.doc(id).update(updateData);
      return await this.findById(id);
    } catch (error) {
      throw new Error(`결제 정보 업데이트 중 오류가 발생했습니다: ${error.message}`);
    }
  }

  async findAll() {
    try {
      const snapshot = await this.collection.get();
      const payments = [];
      snapshot.forEach(doc => {
        payments.push({ id: doc.id, ...doc.data() });
      });
      return payments;
    } catch (error) {
      throw new Error(`결제 목록 조회 중 오류가 발생했습니다: ${error.message}`);
    }
  }
}

module.exports = PaymentRepository;