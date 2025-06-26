const express = require('express');
const TripController = require('../controllers/TripController');
const router = express.Router();
const tripController = new TripController();

/**
 * @swagger
 * /api/trips:
 *   post:
 *     summary: 여행 등록
 *     tags: [Trip]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Trip'
 *     responses:
 *       201:
 *         description: 여행이 성공적으로 등록됨
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Trip'
 *       400:
 *         description: 잘못된 요청 또는 존재하지 않는 호스트 ID
 */
router.post('/', (req, res, next) => tripController.createTrip(req, res, next));

/**
 * @swagger
 * /api/trips:
 *   get:
 *     summary: 여행 목록 조회
 *     tags: [Trip]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, cancelled, completed]
 *         description: 여행 상태로 필터링
 *       - in: query
 *         name: region
 *         schema:
 *           type: string
 *         description: 지역으로 필터링
 *       - in: query
 *         name: hostId
 *         schema:
 *           type: string
 *         description: 호스트 ID로 필터링
 *     responses:
 *       200:
 *         description: 여행 목록 반환 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Trip'
 */
router.get('/', (req, res, next) => tripController.getAllTrips(req, res, next));

/**
 * @swagger
 * /api/trips/{id}:
 *   get:
 *     summary: 특정 여행 조회
 *     tags: [Trip]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 여행 ID
 *     responses:
 *       200:
 *         description: 여행 정보 반환 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Trip'
 *       404:
 *         description: 여행을 찾을 수 없음
 */
router.get('/:id', (req, res, next) => tripController.getTripById(req, res, next));

/**
 * @swagger
 * /api/trips/{id}:
 *   put:
 *     summary: 여행 정보 수정
 *     tags: [Trip]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 여행 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TripUpdate'
 *     responses:
 *       200:
 *         description: 여행 정보 수정 성공
 *       400:
 *         description: 잘못된 요청
 *       404:
 *         description: 여행을 찾을 수 없음
 */
router.put('/:id', (req, res, next) => tripController.updateTrip(req, res, next));

/**
 * @swagger
 * /api/trips/{id}:
 *   delete:
 *     summary: 여행 삭제
 *     tags: [Trip]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 여행 ID
 *     responses:
 *       200:
 *         description: 여행 삭제 성공
 *       400:
 *         description: 참가자가 있는 여행은 삭제할 수 없음
 *       404:
 *         description: 여행을 찾을 수 없음
 */
router.delete('/:id', (req, res, next) => tripController.deleteTrip(req, res, next));

/**
 * @swagger
 * /api/trips/{id}/join:
 *   post:
 *     summary: 여행 참가 신청
 *     tags: [Trip]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 여행 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: 참가 신청할 사용자 이메일
 *             required:
 *               - email
 *     responses:
 *       200:
 *         description: 여행 참가 신청 성공
 *       400:
 *         description: 참가할 수 없는 여행 (마감, 취소됨 등) 또는 존재하지 않는 사용자 이메일
 *       404:
 *         description: 여행을 찾을 수 없음
 */
router.post('/:id/join', (req, res, next) => tripController.joinTrip(req, res, next));

/**
 * @swagger
 * /api/trips/{id}/leave:
 *   post:
 *     summary: 여행 참가 취소
 *     tags: [Trip]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 여행 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: 참가 취소할 사용자 이메일
 *             required:
 *               - email
 *     responses:
 *       200:
 *         description: 여행 참가 취소 성공
 *       400:
 *         description: 참가하지 않은 여행이거나 존재하지 않는 사용자 이메일
 *       404:
 *         description: 여행을 찾을 수 없음
 */
router.post('/:id/leave', (req, res, next) => tripController.leaveTrip(req, res, next));

/**
 * @swagger
 * /api/trips/{id}/cancel:
 *   post:
 *     summary: 여행 취소 (호스트용)
 *     tags: [Trip]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 여행 ID
 *     responses:
 *       200:
 *         description: 여행 취소 성공
 *       404:
 *         description: 여행을 찾을 수 없음
 */
router.post('/:id/cancel', (req, res, next) => tripController.cancelTrip(req, res, next));

/**
 * @swagger
 * components:
 *   schemas:
 *     Trip:
 *       type: object
 *       required:
 *         - hostId
 *         - title
 *         - description
 *         - location
 *         - startDate
 *         - endDate
 *         - maxParticipants
 *         - price
 *       properties:
 *         hostId:
 *           type: string
 *           description: 호스트 ID
 *         title:
 *           type: string
 *           description: 여행 제목
 *         description:
 *           type: string
 *           description: 여행 설명
 *         location:
 *           type: object
 *           properties:
 *             region:
 *               type: string
 *               description: 지역
 *             address:
 *               type: string
 *               description: 상세 주소
 *         startDate:
 *           type: string
 *           format: date
 *           description: 시작 날짜
 *         endDate:
 *           type: string
 *           format: date
 *           description: 종료 날짜
 *         maxParticipants:
 *           type: integer
 *           minimum: 1
 *           description: 최대 참가자 수
 *         currentParticipants:
 *           type: integer
 *           minimum: 0
 *           description: 현재 참가자 수
 *         price:
 *           type: number
 *           minimum: 0
 *           description: 여행 가격
 *         included:
 *           type: array
 *           items:
 *             type: string
 *           description: 포함 사항
 *         excluded:
 *           type: array
 *           items:
 *             type: string
 *           description: 불포함 사항
 *         itinerary:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               day:
 *                 type: integer
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               activities:
 *                 type: array
 *                 items:
 *                   type: string
 *           description: 여행 일정
 *         status:
 *           type: string
 *           enum: [active, cancelled, completed]
 *           description: 여행 상태
 *     TripUpdate:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         location:
 *           type: object
 *           properties:
 *             region:
 *               type: string
 *             address:
 *               type: string
 *         startDate:
 *           type: string
 *           format: date
 *         endDate:
 *           type: string
 *           format: date
 *         maxParticipants:
 *           type: integer
 *           minimum: 1
 *         price:
 *           type: number
 *           minimum: 0
 *         included:
 *           type: array
 *           items:
 *             type: string
 *         excluded:
 *           type: array
 *           items:
 *             type: string
 *         itinerary:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               day:
 *                 type: integer
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               activities:
 *                 type: array
 *                 items:
 *                   type: string
 *         status:
 *           type: string
 *           enum: [active, cancelled, completed]
 */

module.exports = router;