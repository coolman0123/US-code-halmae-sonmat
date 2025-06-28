const PaymentRepository = require('../repositories/PaymentRepository');
const TripRepository = require('../../trip/repositories/TripRepository');
const UserRepository = require('../../user/repositories/UserRepository');
const HostRepository = require('../../host/repositories/HostRepository');

class PaymentService {
  constructor() {
    this.paymentRepository = new PaymentRepository();
    this.tripRepository = new TripRepository();
    this.userRepository = new UserRepository();
    this.hostRepository = new HostRepository();
  }

  async createPayment(paymentData) {
    try {
      // 유효성 검사
      if (!paymentData.userId) {
        throw new Error('사용자 ID는 필수입니다.');
      }

      if (!paymentData.tripId) {
        throw new Error('여행 ID는 필수입니다.');
      }

      // 사용자 존재 확인
      const user = await this.userRepository.findById(paymentData.userId);
      if (!user) {
        throw new Error('존재하지 않는 사용자입니다.');
      }

      // 여행 존재 확인 및 예약 가능 여부 체크
      const trip = await this.tripRepository.findById(paymentData.tripId);
      if (!trip) {
        throw new Error('존재하지 않는 여행입니다.');
      }

      if (trip.status !== 'active') {
        throw new Error('예약할 수 없는 여행입니다.');
      }

      if (trip.currentParticipants >= trip.maxParticipants) {
        throw new Error('예약이 마감된 여행입니다.');
      }

      // 호스트 정보 확인
      const host = await this.hostRepository.findById(trip.hostId);
      if (!host) {
        throw new Error('호스트 정보를 찾을 수 없습니다.');
      }

      // 결제 데이터 생성
      const payment = await this.paymentRepository.create({
        ...paymentData,
        hostId: trip.hostId,
        paymentStatus: 'pending'
      });

      return payment;
    } catch (error) {
      throw new Error(`결제 생성 중 오류가 발생했습니다: ${error.message}`);
    }
  }

  async processPayment(paymentId) {
    try {
      const payment = await this.paymentRepository.findById(paymentId);
      if (!payment) {
        throw new Error('결제 정보를 찾을 수 없습니다.');
      }

      if (payment.paymentStatus !== 'pending') {
        throw new Error('이미 처리된 결제입니다.');
      }

      // 실제 결제 처리 로직 (외부 결제 API 연동)
      // 여기서는 간단히 성공으로 처리
      const updatedPayment = await this.paymentRepository.update(paymentId, {
        paymentStatus: 'completed',
        paymentDate: new Date()
      });

      // 여행 참가자 추가
      const trip = await this.tripRepository.findById(payment.tripId);
      const participants = trip.participants || [];
      
      if (!participants.includes(payment.guestInfo.email)) {
        participants.push(payment.guestInfo.email);
        await this.tripRepository.updateParticipants(
          payment.tripId, 
          participants, 
          trip.currentParticipants + 1
        );
      }

      return updatedPayment;
    } catch (error) {
      // 결제 실패 시 상태 업데이트
      if (paymentId) {
        await this.paymentRepository.update(paymentId, {
          paymentStatus: 'failed'
        });
      }
      throw new Error(`결제 처리 중 오류가 발생했습니다: ${error.message}`);
    }
  }

  async getUserPayments(userId) {
    try {
      return await this.paymentRepository.findByUserId(userId);
    } catch (error) {
      throw new Error(`사용자 결제 내역 조회 중 오류가 발생했습니다: ${error.message}`);
    }
  }

  async getPaymentById(id) {
    try {
      const payment = await this.paymentRepository.findById(id);
      if (!payment) {
        throw new Error('결제 정보를 찾을 수 없습니다.');
      }
      return payment;
    } catch (error) {
      throw new Error(`결제 조회 중 오류가 발생했습니다: ${error.message}`);
    }
  }

  async refundPayment(paymentId) {
    try {
      const payment = await this.paymentRepository.findById(paymentId);
      if (!payment) {
        throw new Error('결제 정보를 찾을 수 없습니다.');
      }

      if (payment.paymentStatus !== 'completed') {
        throw new Error('완료된 결제만 환불할 수 있습니다.');
      }

      // 실제 환불 처리 로직
      const updatedPayment = await this.paymentRepository.update(paymentId, {
        paymentStatus: 'refunded'
      });

      // 여행 참가자 목록에서 제거
      const trip = await this.tripRepository.findById(payment.tripId);
      const participants = trip.participants || [];
      const updatedParticipants = participants.filter(email => email !== payment.guestInfo.email);
      
      await this.tripRepository.updateParticipants(
        payment.tripId, 
        updatedParticipants, 
        Math.max(0, trip.currentParticipants - 1)
      );

      return updatedPayment;
    } catch (error) {
      throw new Error(`환불 처리 중 오류가 발생했습니다: ${error.message}`);
    }
  }
}

module.exports = PaymentService;