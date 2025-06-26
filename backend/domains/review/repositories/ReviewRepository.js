const FirebaseRepository = require('../../../firebase/FirebaseRepository.js');
const admin = require('../../../firebase/admin.js');
const Review = require('../entities/Review.js');

class ReviewRepository extends FirebaseRepository {
  constructor() {
    super('reviews');
  }

  async create(reviewData) {
    const review = new Review(reviewData);
    const obj = review.toJSON();
    delete obj.id; // Firestore에 저장 시 id 제거
    const docRef = await this.collection.add(obj);
    return { id: docRef.id, ...obj };
  }

  async findAll() {
    const snapshot = await this.collection.get();
    // 메모리에서 정렬 (임시 해결책)
    const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return docs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async findById(reviewId) {
    const doc = await this.collection.doc(reviewId).get();
    if (!doc.exists) {
      throw new Error('리뷰를 찾을 수 없습니다.');
    }
    return { id: doc.id, ...doc.data() };
  }

  async findByHostId(hostId) {
    const snapshot = await this.collection
      .where('hostId', '==', hostId)
      .get();
    // 메모리에서 정렬 (임시 해결책)
    const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return docs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async findByUserId(userId) {
    const snapshot = await this.collection
      .where('userId', '==', userId)
      .get();
    // 메모리에서 정렬 (임시 해결책)
    const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return docs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async update(reviewId, updateData) {
    const updateObj = {
      ...updateData,
      updatedAt: new Date()
    };
    await this.collection.doc(reviewId).update(updateObj);
    return await this.findById(reviewId);
  }

  async delete(reviewId) {
    await this.collection.doc(reviewId).delete();
    return { message: '리뷰가 삭제되었습니다.' };
  }

  // 호스트별 평균 평점 계산
  async getAverageRatingByHostId(hostId) {
    const reviews = await this.findByHostId(hostId);
    if (reviews.length === 0) return 0;
    
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return Number((totalRating / reviews.length).toFixed(1));
  }

  // 사용자가 특정 호스트에 이미 리뷰를 작성했는지 확인
  async hasUserReviewedHost(userId, hostId) {
    const snapshot = await this.collection
      .where('userId', '==', userId)
      .where('hostId', '==', hostId)
      .get();
    return !snapshot.empty;
  }
}

module.exports = ReviewRepository; 