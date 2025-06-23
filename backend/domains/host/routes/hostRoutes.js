const express = require('express');
const HostController = require('../controllers/HostController');
const router = express.Router();
const hostController = new HostController();

/**
 * @swagger
 * /api/hosts:
 *   post:
 *     summary: 할머니 등록
 *     tags: [Host]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Host'
 *     responses:
 *       201:
 *         description: 성공적으로 등록됨
 */
router.post('/', (req, res, next) => hostController.registerHost(req, res, next));

/**
 * @swagger
 * /api/hosts:
 *   get:
 *     summary: 모든 할머니 목록 조회
 *     tags: [Host]
 *     responses:
 *       200:
 *         description: 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Host'
 */
router.get('/', (req, res, next) => hostController.getAllHosts(req, res, next));

/**
 * @swagger
 * components:
 *   schemas:
 *     Host:
 *       type: object
 *       required:
 *         - name
 *         - location
 *         - contact
 *       properties:
 *         name:
 *           type: string
 *         age:
 *           type: integer
 *         location:
 *           type: object
 *           properties:
 *             region:
 *               type: string
 *             address:
 *               type: string
 *         contact:
 *           type: object
 *           properties:
 *             phone:
 *               type: string
 *         description:
 *           type: string
 */
module.exports = router;
