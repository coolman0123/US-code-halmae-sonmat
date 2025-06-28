const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');

const authController = new AuthController();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: 회원가입
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *               - phone
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: 회원가입 성공
 *       400:
 *         description: 잘못된 요청
 */
router.post('/register', (req, res) => authController.register(req, res));

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: 로그인
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: 로그인 성공
 *       401:
 *         description: 인증 실패
 */
router.post('/login', (req, res) => authController.login(req, res));

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: 로그아웃
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: 로그아웃 성공
 */
router.post('/logout', (req, res) => authController.logout(req, res));

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: 현재 로그인된 사용자 정보 조회
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: 사용자 정보 반환
 *       401:
 *         description: 인증되지 않음
 */
router.get('/me', (req, res) => authController.getCurrentUser(req, res));

/**
 * @swagger
 * /api/auth/validate:
 *   get:
 *     summary: 토큰/세션 유효성 검사
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: 유효한 세션
 *       401:
 *         description: 유효하지 않은 세션
 */
router.get('/validate', (req, res) => authController.validateToken(req, res));

module.exports = router; 