class Review {
  constructor({ id, hostId, userId, rating, content, createdAt, updatedAt }) {
    this.id = id;
    this.hostId = hostId; // Firebase에서 자동생성된 host 키
    this.userId = userId; // 사용자 ID
    this.rating = rating; // 별점 (1-5)
    this.content = content; // 리뷰 내용
    this.createdAt = createdAt ?? new Date();
    this.updatedAt = updatedAt ?? new Date();
    this.validate();
  }

  validate() {
    if (!this.hostId) throw new Error('호스트 ID는 필수입니다.');
    if (!this.userId) throw new Error('사용자 ID는 필수입니다.');
    
    // rating 값 타입 변환 및 검증
    const ratingNumber = Number(this.rating);
    if (isNaN(ratingNumber) || ratingNumber < 1 || ratingNumber > 5) {
      throw new Error(`평점은 1-5 사이의 값이어야 합니다. 현재 값: ${this.rating} (타입: ${typeof this.rating})`);
    }
    this.rating = ratingNumber; // 숫자로 변환하여 저장
    
    if (!this.content || this.content.trim().length === 0) {
      throw new Error('리뷰 내용은 필수입니다.');
    }
    if (this.content.length > 1000) {
      throw new Error('리뷰 내용은 1000자를 초과할 수 없습니다.');
    }
  }

  toJSON() {
    const obj = { ...this };
    // undefined 값은 Firestore에 저장하지 않도록 필터링
    Object.keys(obj).forEach(key => {
      if (obj[key] === undefined) delete obj[key];
    });
    return obj;
  }
}

module.exports = Review; 