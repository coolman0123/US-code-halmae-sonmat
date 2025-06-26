class Trip {
  constructor({ 
    id, 
    hostId, 
    title, 
    description, 
    location, 
    startDate, 
    endDate, 
    maxParticipants, 
    currentParticipants = 0,
    price, 
    included, 
    excluded,
    itinerary,
    status = 'active', // active, cancelled, completed 셋으로
    createdAt, 
    updatedAt 
  }) {
    this.id = id;
    this.hostId = hostId;
    this.title = title;
    this.description = description;
    this.location = location;
    this.startDate = startDate;
    this.endDate = endDate;
    this.maxParticipants = maxParticipants;
    this.currentParticipants = currentParticipants;
    this.price = price;
    this.included = included || [];
    this.excluded = excluded || [];
    this.itinerary = itinerary || [];
    this.status = status;
    this.createdAt = createdAt ?? new Date();
    this.updatedAt = updatedAt ?? new Date();
    this.validate();
  }

  validate() {
    if (!this.hostId) throw new Error('호스트 ID는 필수입니다.');
    if (!this.title) throw new Error('여행 제목은 필수입니다.');
    if (!this.description) throw new Error('여행 설명은 필수입니다.');
    if (!this.location || !this.location.region) throw new Error('여행 지역 정보는 필수입니다.');
    if (!this.startDate) throw new Error('시작 날짜는 필수입니다.');
    if (!this.endDate) throw new Error('종료 날짜는 필수입니다.');
    if (!this.maxParticipants || this.maxParticipants <= 0) throw new Error('최대 참가자 수는 1명 이상이어야 합니다.');
    if (!this.price || this.price < 0) throw new Error('가격 정보는 필수입니다.');
    

    const start = new Date(this.startDate);
    const end = new Date(this.endDate);
    if (start >= end) throw new Error('종료 날짜는 시작 날짜보다 늦어야 합니다.');
    if (start < new Date()) throw new Error('시작 날짜는 현재 날짜보다 늦어야 합니다.');
  }


  canJoin() {
    return this.status === 'active' && this.currentParticipants < this.maxParticipants;
  }

  addParticipant() {
    if (!this.canJoin()) {
      throw new Error('참가할 수 없는 여행입니다.');
    }
    this.currentParticipants += 1;
    this.updatedAt = new Date();
  }
  removeParticipant() {
    if (this.currentParticipants <= 0) {
      throw new Error('참가자가 없습니다.');
    }
    this.currentParticipants -= 1;
    this.updatedAt = new Date();
  }
  toJSON() {
    const obj = { ...this };
    Object.keys(obj).forEach(key => {
      if (obj[key] === undefined) delete obj[key];
    });
    return obj;
  }

}

module.exports = Trip;