const express = require('express');
const UserController = require('../domains/user/controllers/UserController');
const router = express.Router();
const userController = new UserController();

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: 모든 사용자 조회
 *     tags: [User]
 *     responses:
 *       200:
 *         description: 사용자 목록 반환 성공
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
 *                     $ref: '#/components/schemas/User'
 */
router.get('/', (req, res, next) => userController.getAllUsers(req, res, next));

/**
 * @swagger
 * /api/users/{userId}:
 *   get:
 *     summary: 특정 사용자 조회
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: 사용자 ID
 *     responses:
 *       200:
 *         description: 사용자 정보 반환 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         description: 사용자를 찾을 수 없음
 */
router.get('/:userId', (req, res, next) => userController.getUserById(req, res, next));

/**
 * @swagger
 * /api/users/{userId}:
 *   put:
 *     summary: 사용자 정보 수정
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: 사용자 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdate'
 *     responses:
 *       200:
 *         description: 사용자 정보 수정 성공
 *       404:
 *         description: 사용자를 찾을 수 없음
 */
router.put('/:userId', (req, res, next) => userController.updateUser(req, res, next));

/**
 * @swagger
 * /api/users/{userId}:
 *   delete:
 *     summary: 사용자 삭제
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: 사용자 ID
 *     responses:
 *       200:
 *         description: 사용자 삭제 성공
 *       404:
 *         description: 사용자를 찾을 수 없음
 */
router.delete('/:userId', (req, res, next) => userController.deleteUser(req, res, next));

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: 사용자 ID
 *         email:
 *           type: string
 *           format: email
 *           description: 이메일
 *         name:
 *           type: string
 *           description: 이름
 *         phone:
 *           type: string
 *           description: 전화번호
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: 가입일시
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: 수정일시
 *     UserUpdate:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: 이름
 *         phone:
 *           type: string
 *           description: 전화번호
 */

module.exports = router;
