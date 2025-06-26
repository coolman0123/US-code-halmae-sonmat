const ReviewRepository = require('../repositories/ReviewRepository');
const HostRepository = require('../../host/repositories/HostRepository');
const UserRepository = require('../../user/repositories/UserRepository');

class ReviewService {
  constructor() {
    this.reviewRepository = new ReviewRepository();
    this.hostRepository = new HostRepository();
    this.userRepository = new UserRepository();
  }

  async createReview(reviewData) {
    const { hostId, userId } = reviewData;

    // 호스트 존재 여부 확인
    try {
      await this.hostRepository.findById(hostId);
    } catch (error) {
      throw new Error('존재하지 않는 호스트입니다.');
    }

    // 사용자 존재 여부 확인 (UserRepository에 findById가 있다고 가정)
    try {
      await this.userRepository.findById(userId);
    } catch (error) {
      throw new Error('존재하지 않는 사용자입니다.');
    }

    // 중복 리뷰 확인
    const hasReviewed = await this.reviewRepository.hasUserReviewedHost(userId, hostId);
    if (hasReviewed) {
      throw new Error('이미 해당 호스트에 리뷰를 작성하셨습니다.');
    }

    return await this.reviewRepository.create(reviewData);
  }

  async getAllReviews() {
    return await this.reviewRepository.findAll();
  }

  async getReviewById(reviewId) {
    return await this.reviewRepository.findById(reviewId);
  }

  async getReviewsByHostId(hostId) {
    return await this.reviewRepository.findByHostId(hostId);
  }

  async getReviewsByUserId(userId) {
    return await this.reviewRepository.findByUserId(userId);
  }

  async updateReview(reviewId, userId, updateData) {
    // 리뷰 존재 여부 및 권한 확인
    const review = await this.reviewRepository.findById(reviewId);
    if (review.userId !== userId) {
      throw new Error('리뷰를 수정할 권한이 없습니다.');
    }

    // 평점과 내용만 수정 가능
    const allowedUpdates = ['rating', 'content'];
    const filteredUpdateData = {};
    
    Object.keys(updateData).forEach(key => {
      if (allowedUpdates.includes(key)) {
        filteredUpdateData[key] = updateData[key];
      }
    });

    if (Object.keys(filteredUpdateData).length === 0) {
      throw new Error('수정할 수 있는 필드가 없습니다.');
    }

    return await this.reviewRepository.update(reviewId, filteredUpdateData);
  }

  async deleteReview(reviewId, userId) {
    // 리뷰 존재 여부 및 권한 확인
    const review = await this.reviewRepository.findById(reviewId);
    if (review.userId !== userId) {
      throw new Error('리뷰를 삭제할 권한이 없습니다.');
    }

    return await this.reviewRepository.delete(reviewId);
  }

  async getHostAverageRating(hostId) {
    return await this.reviewRepository.getAverageRatingByHostId(hostId);
  }

  // 호스트 정보와 함께 리뷰 목록 조회
  async getReviewsWithHostInfo(hostId) {
    const reviews = await this.reviewRepository.findByHostId(hostId);
    const averageRating = await this.reviewRepository.getAverageRatingByHostId(hostId);
    
    return {
      reviews,
      averageRating,
      totalReviews: reviews.length
    };
  }
}

module.exports = ReviewService; 