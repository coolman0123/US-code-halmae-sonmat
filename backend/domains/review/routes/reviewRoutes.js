const express = require('express');
const ReviewController = require('../controllers/ReviewController');
const router = express.Router();
const reviewController = new ReviewController();

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: 리뷰 작성
 *     tags: [Review]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReviewInput'
 *     responses:
 *       201:
 *         description: 리뷰가 성공적으로 작성됨
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReviewResponse'
 */
router.post('/', (req, res, next) => reviewController.createReview(req, res, next));

/**
 * @swagger
 * /api/reviews:
 *   get:
 *     summary: 모든 리뷰 조회
 *     tags: [Review]
 *     responses:
 *       200:
 *         description: 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 */
router.get('/', (req, res, next) => reviewController.getAllReviews(req, res, next));

/**
 * @swagger
 * /api/reviews/{reviewId}:
 *   get:
 *     summary: 특정 리뷰 조회
 *     tags: [Review]
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 */
router.get('/:reviewId', (req, res, next) => reviewController.getReviewById(req, res, next));

/**
 * @swagger
 * /api/reviews/host/{hostId}:
 *   get:
 *     summary: 호스트별 리뷰 조회 (평균 평점 포함)
 *     tags: [Review]
 *     parameters:
 *       - in: path
 *         name: hostId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HostReviewInfo'
 */
router.get('/host/:hostId', (req, res, next) => reviewController.getReviewsByHostId(req, res, next));

/**
 * @swagger
 * /api/reviews/user/{userId}:
 *   get:
 *     summary: 사용자별 리뷰 조회
 *     tags: [Review]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 */
router.get('/user/:userId', (req, res, next) => reviewController.getReviewsByUserId(req, res, next));

/**
 * @swagger
 * /api/reviews/host/{hostId}/rating:
 *   get:
 *     summary: 호스트 평균 평점 조회
 *     tags: [Review]
 *     parameters:
 *       - in: path
 *         name: hostId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     averageRating:
 *                       type: number
 *                       example: 4.5
 *                       description: 호스트의 평균 평점 (0-5)
 */
router.get('/host/:hostId/rating', (req, res, next) => reviewController.getHostAverageRating(req, res, next));

/**
 * @swagger
 * /api/reviews/{reviewId}:
 *   put:
 *     summary: 리뷰 수정
 *     tags: [Review]
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReviewUpdateInput'
 *     responses:
 *       200:
 *         description: 리뷰가 성공적으로 수정됨
 */
router.put('/:reviewId', (req, res, next) => reviewController.updateReview(req, res, next));

/**
 * @swagger
 * /api/reviews/{reviewId}:
 *   delete:
 *     summary: 리뷰 삭제
 *     tags: [Review]
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: 리뷰가 성공적으로 삭제됨
 */
router.delete('/:reviewId', (req, res, next) => reviewController.deleteReview(req, res, next));

/**
 * @swagger
 * components:
 *   schemas:
 *     ReviewInput:
 *       type: object
 *       required:
 *         - hostId
 *         - userId
 *         - rating
 *         - content
 *       properties:
 *         hostId:
 *           type: string
 *           description: Firebase에서 자동생성된 호스트 ID
 *         userId:
 *           type: string
 *           description: 사용자 ID
 *         rating:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *           description: 별점 (1-5)
 *         content:
 *           type: string
 *           maxLength: 1000
 *           description: 리뷰 내용
 *     
 *     ReviewUpdateInput:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           description: 수정 권한 확인용 사용자 ID
 *         rating:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *         content:
 *           type: string
 *           maxLength: 1000
 *     
 *     Review:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         hostId:
 *           type: string
 *         userId:
 *           type: string
 *         rating:
 *           type: integer
 *         content:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     
 *     ReviewResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           $ref: '#/components/schemas/Review'
 *     
 *     HostReviewInfo:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         data:
 *           type: object
 *           properties:
 *             reviews:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 *             averageRating:
 *               type: number
 *             totalReviews:
 *               type: integer
 */

module.exports = router; 