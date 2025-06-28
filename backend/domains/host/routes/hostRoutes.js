const express = require('express');
const HostController = require('../controllers/HostController');
const router = express.Router();
const hostController = new HostController();

/**
 * @swagger
 * /api/hosts:
 *   post:
 *     summary: Host 등록
 *     description: 새로운 Host를 등록합니다. PAGE1과 PAGE2 정보를 모두 포함해야 합니다.
 *     tags: [Host]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HostRegister'
 *     responses:
 *       201:
 *         description: Host 등록이 완료되었습니다
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Host 등록이 완료되었습니다."
 *                 data:
 *                   $ref: '#/components/schemas/Host'
 *       400:
 *         description: 잘못된 요청 (필수 필드 누락 등)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "호스트 한줄 소개는 필수입니다."
 */
router.post('/', (req, res, next) => hostController.registerHost(req, res, next));

/**
 * @swagger
 * /api/hosts:
 *   get:
 *     summary: 모든 Host 목록 조회
 *     tags: [Host]
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
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Host'
 */
router.get('/', (req, res, next) => hostController.getAllHosts(req, res, next));

/**
 * @swagger
 * /api/hosts/geocoding:
 *   get:
 *     summary: Kakao Maps Geocoding API Proxy
 *     description: 주소를 입력받아 위도/경도를 반환하는 카카오 지오코딩 프록시 API
 *     tags: [Host]
 *     parameters:
 *       - in: query
 *         name: address
 *         required: true
 *         description: 검색할 주소
 *         schema:
 *           type: string
 *           example: "선릉로 221"
 *     responses:
 *       200:
 *         description: 카카오 지오코딩 성공
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
 *                     address:
 *                       type: string
 *                       example: "선릉로 221"
 *                     formattedAddress:
 *                       type: string
 *                       example: "서울 강남구 선릉로 221"
 *                     roadAddress:
 *                       type: string
 *                       example: "서울 강남구 선릉로 221"
 *                     latitude:
 *                       type: number
 *                       example: 37.5074846
 *                     longitude:
 *                       type: number
 *                       example: 127.0484407
 *                     addressType:
 *                       type: string
 *                       example: "REGION_ADDR"
 *       400:
 *         description: 잘못된 요청
 *       401:
 *         description: Kakao API 키 인증 실패
 *       403:
 *         description: Kakao API 접근 거부
 *       404:
 *         description: 검색 결과 없음
 *       429:
 *         description: API 사용량 한도 초과
 *       500:
 *         description: 서버 오류
 */
router.get('/geocoding', (req, res, next) => hostController.geocoding(req, res, next));

/**
 * @swagger
 * /api/hosts/{hostId}:
 *   get:
 *     summary: 특정 Host 조회
 *     tags: [Host]
 *     parameters:
 *       - in: path
 *         name: hostId
 *         required: true
 *         schema:
 *           type: string
 *         description: 조회할 호스트 ID
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
 *                   $ref: '#/components/schemas/Host'
 *       404:
 *         description: 호스트를 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "호스트를 찾을 수 없습니다."
 */
router.get('/:hostId', (req, res, next) => hostController.getHostById(req, res, next));

/**
 * @swagger
 * /api/hosts/{hostId}:
 *   delete:
 *     summary: Host 삭제
 *     description: 지정된 ID의 Host를 삭제합니다.
 *     tags: [Host]
 *     parameters:
 *       - in: path
 *         name: hostId
 *         required: true
 *         schema:
 *           type: string
 *         description: 삭제할 호스트 ID
 *     responses:
 *       200:
 *         description: 호스트가 성공적으로 삭제되었습니다
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "호스트가 성공적으로 삭제되었습니다."
 *                 data:
 *                   type: object
 *                   properties:
 *                     deletedHostId:
 *                       type: string
 *                       example: "host123"
 *                     deletedHost:
 *                       $ref: '#/components/schemas/Host'
 *       400:
 *         description: 잘못된 요청 (호스트 ID 누락)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "호스트 ID가 필요합니다."
 *       404:
 *         description: 삭제할 호스트를 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "삭제할 호스트를 찾을 수 없습니다."
 */
router.delete('/:hostId', (req, res, next) => hostController.deleteHost(req, res, next));

/**
 * @swagger
 * components:
 *   schemas:
 *     HostRegister:
 *       type: object
 *       required:
 *         - hostIntroduction
 *         - age
 *         - characteristics
 *         - representativeMenu
 *         - personalitySummary
 *         - address
 *         - contact
 *         - houseNickname
 *         - maxGuests
 *         - bedroomCount
 *         - bedCount
 *         - amenities
 *         - housePhotos
 *         - availableExperiences
 *         - accommodationFee
 *       properties:
 *         hostIntroduction:
 *           type: string
 *           description: 호스트 한줄 소개
 *           example: "따뜻한 마음으로 손님을 맞이하는 할머니입니다."
 *         age:
 *           type: integer
 *           description: 연세
 *           example: 75
 *         characteristics:
 *           type: string
 *           description: 특징
 *           example: "손님을 가족처럼 대하며, 전통 요리에 능숙합니다."
 *         representativeMenu:
 *           type: string
 *           description: 대표 메뉴
 *           example: "된장찌개, 김치찌개, 시골 백반"
 *         personalitySummary:
 *           type: string
 *           description: 성격 한 줄 요약
 *           example: "인자하고 정이 많은 성격"
 *         address:
 *           type: object
 *           description: 주소 정보
 *           required:
 *             - zipCode
 *             - detailAddress
 *           properties:
 *             zipCode:
 *               type: string
 *               description: 우편번호
 *               example: "12345"
 *             detailAddress:
 *               type: string
 *               description: 상세주소
 *               example: "경기도 양평군 용문면 연꽃마을 123번지"
 *         contact:
 *           type: object
 *           description: 연락처
 *           required:
 *             - phone
 *           properties:
 *             phone:
 *               type: string
 *               description: 전화번호
 *               example: "010-1234-5678"
 *         houseNickname:
 *           type: string
 *           description: HOST 집 닉네임 (중복 불가)
 *           example: "연꽃마을 할머니댁"
 *         maxGuests:
 *           type: integer
 *           description: 숙박가능인원 (1 이상)
 *           minimum: 1
 *           example: 4
 *         bedroomCount:
 *           type: integer
 *           description: 침실개수 (1 이상)
 *           minimum: 1
 *           example: 2
 *         bedCount:
 *           type: integer
 *           description: 침대개수 (1 이상)
 *           minimum: 1
 *           example: 3
 *         amenities:
 *           type: array
 *           description: 숙소 편의시설 정보 (아래 허용된 값 중 선택)
 *           items:
 *             type: string
 *             enum: 
 *               - "와이파이"
 *               - "TV"
 *               - "주방"
 *               - "세탁기"
 *               - "건물 내 무료 주차"
 *               - "건물 내/외 유료 주차"
 *               - "에어컨"
 *               - "업무 전용 공간"
 *           example: ["와이파이", "TV", "주방", "세탁기", "건물 내 무료 주차", "에어컨", "업무 전용 공간"]
 *         housePhotos:
 *           type: array
 *           description: 집 사진 3장 (정확히 3개 필요)
 *           items:
 *             type: string
 *           minItems: 3
 *           maxItems: 3
 *           example: ["https://example.com/photo1.jpg", "https://example.com/photo2.jpg", "https://example.com/photo3.jpg"]
 *         availableExperiences:
 *           type: string
 *           description: 체험 가능한 일손 작성
 *           example: "농사 체험, 전통 요리 배우기, 산책로 안내"
 *         accommodationFee:
 *           type: string
 *           description: 숙박비
 *           example: "50000원/박"
 *     Host:
 *       allOf:
 *         - $ref: '#/components/schemas/HostRegister'
 *         - type: object
 *           properties:
 *             id:
 *               type: string
 *               description: Host ID
 *               example: "host123456"
 *             createdAt:
 *               type: string
 *               format: date-time
 *               description: 생성일시
 *               example: "2024-01-01T00:00:00.000Z"
 *             updatedAt:
 *               type: string
 *               format: date-time
 *               description: 수정일시
 *               example: "2024-01-01T00:00:00.000Z"
 */

module.exports = router;
