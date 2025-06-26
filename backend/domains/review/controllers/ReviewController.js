const ReviewService = require('../services/ReviewService');

class ReviewController {
  constructor() {
    this.reviewService = new ReviewService();
  }

  // 리뷰 생성
  async createReview(req, res, next) {
    try {
      console.log('🔍 받은 요청 데이터:', req.body);
      console.log('🔍 rating 타입:', typeof req.body.rating, '값:', req.body.rating);
      
      const review = await this.reviewService.createReview(req.body);
      
      console.log('✅ 생성된 리뷰:', review);
      
      res.status(201).json({
        success: true,
        message: '리뷰가 성공적으로 작성되었습니다.',
        data: review
      });
    } catch (error) {
      console.error('❌ 리뷰 생성 오류:', error.message);
      next(error);
    }
  }

  // 모든 리뷰 조회
  async getAllReviews(req, res, next) {
    try {
      const reviews = await this.reviewService.getAllReviews();
      res.status(200).json({
        success: true,
        data: reviews
      });
    } catch (error) {
      next(error);
    }
  }

  // 특정 리뷰 조회
  async getReviewById(req, res, next) {
    try {
      const { reviewId } = req.params;
      const review = await this.reviewService.getReviewById(reviewId);
      res.status(200).json({
        success: true,
        data: review
      });
    } catch (error) {
      next(error);
    }
  }

  // 호스트별 리뷰 조회
  async getReviewsByHostId(req, res, next) {
    try {
      const { hostId } = req.params;
      const result = await this.reviewService.getReviewsWithHostInfo(hostId);
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  // 사용자별 리뷰 조회
  async getReviewsByUserId(req, res, next) {
    try {
      const { userId } = req.params;
      const reviews = await this.reviewService.getReviewsByUserId(userId);
      res.status(200).json({
        success: true,
        data: reviews
      });
    } catch (error) {
      next(error);
    }
  }

  // 리뷰 수정
  async updateReview(req, res, next) {
    try {
      const { reviewId } = req.params;
      const { userId } = req.body; // 실제로는 JWT 토큰에서 추출해야 함
      const review = await this.reviewService.updateReview(reviewId, userId, req.body);
      res.status(200).json({
        success: true,
        message: '리뷰가 성공적으로 수정되었습니다.',
        data: review
      });
    } catch (error) {
      next(error);
    }
  }

  // 리뷰 삭제
  async deleteReview(req, res, next) {
    try {
      const { reviewId } = req.params;
      const { userId } = req.body; // 실제로는 JWT 토큰에서 추출해야 함
      const result = await this.reviewService.deleteReview(reviewId, userId);
      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      next(error);
    }
  }

  // 호스트 평균 평점 조회
  async getHostAverageRating(req, res, next) {
    try {
      const { hostId } = req.params;
      const averageRating = await this.reviewService.getHostAverageRating(hostId);
      res.status(200).json({
        success: true,
        data: { averageRating }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ReviewController; 