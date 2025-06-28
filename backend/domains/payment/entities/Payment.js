class Payment {
  constructor({ 
    id, 
    userId,
    tripId,
    hostId,
    guestInfo,
    bookingDetails,
    amount,
    paymentMethod,
    paymentStatus = 'pending', // pending, completed, failed, refunded
    paymentDate,
    createdAt, 
    updatedAt 
  }) {
    this.id = id;
    this.userId = userId;
    this.tripId = tripId;
    this.hostId = hostId;
    this.guestInfo = guestInfo; // 예약자 정보 (이름, 전화번호, 이메일)
    this.bookingDetails = bookingDetails; // 예약 상세 정보 (날짜, 객실, 인원 등)
    this.amount = amount;
    this.paymentMethod = paymentMethod; // card, bank_transfer, etc.
    this.paymentStatus = paymentStatus;
    this.paymentDate = paymentDate;
    this.createdAt = createdAt ?? new Date();
    this.updatedAt = updatedAt ?? new Date();
    this.validate();
  }

  validate() {
    if (!this.userId) throw new Error('사용자 ID는 필수입니다.');
    if (!this.tripId) throw new Error('여행 ID는 필수입니다.');
    if (!this.hostId) throw new Error('호스트 ID는 필수입니다.');
    if (!this.guestInfo || !this.guestInfo.name || !this.guestInfo.phone || !this.guestInfo.email) {
      throw new Error('예약자 정보(이름, 전화번호, 이메일)는 필수입니다.');
    }
    if (!this.bookingDetails) throw new Error('예약 상세 정보는 필수입니다.');
    if (!this.amount || this.amount <= 0) throw new Error('결제 금액은 0보다 커야 합니다.');
    if (!this.paymentMethod) throw new Error('결제 방법은 필수입니다.');
  }

  toJSON() {
    const obj = { ...this };
    Object.keys(obj).forEach(key => {
      if (obj[key] === undefined) delete obj[key];
    });
    return obj;
  }
}

module.exports = Payment;