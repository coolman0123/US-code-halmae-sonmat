const HostService = require('../services/HostService');
require('dotenv').config();

const axios = require('axios');

class HostController {
  constructor() { 
    this.hostService = new HostService(); 
  }

  /**
   * Host 등록
   * Request Body:
   * PAGE1:
   * - hostIntroduction: 호스트 한줄 소개 (string, required)
   * - age: 연세 (number, required)
   * - characteristics: 특징 (string, required)
   * - representativeMenu: 대표 메뉴 (string, required)
   * - personalitySummary: 성격 한 줄 요약 (string, required)
   * 
   * PAGE2:
   * - address: 주소 정보 (object, required)
   *   - zipCode: 우편번호 (string, required)
   *   - detailAddress: 상세주소 (string, required)
   * - latitude: 위도 (number, required)
   * - longitude: 경도 (number, required)
   * - contact: 연락처 (object, required)
   *   - phone: 전화번호 (string, required)
   * - houseNickname: HOST 집 닉네임 (string, required)
   * - maxGuests: 숙박가능인원 (number, required)
   * - bedroomCount: 침실개수 (number, required)
   * - bedCount: 침대개수 (number, required)
   * - amenities: 숙소 편의시설 정보 (array, required)
   * - housePhotos: 집 사진 3장 (array, length=3, required)
   * - availableExperiences: 체험 가능한 일손 작성 (string, required)
   * - accommodationFee: 숙박비 (string, required)
   */
  async registerHost(req, res, next) {
    try {
      // Request body 구조 확인
      const {
        // PAGE1
        hostIntroduction,
        age,
        characteristics,
        representativeMenu,
        personalitySummary,
        
        // PAGE2
        address,
        latitude,
        longitude,
        contact,
        houseNickname,
        maxGuests,
        bedroomCount,
        bedCount,
        amenities,
        housePhotos,
        availableExperiences,
        accommodationFee
      } = req.body;

      const hostData = {
        hostIntroduction,
        age,
        characteristics,
        representativeMenu,
        personalitySummary,
        address,
        latitude,
        longitude,
        contact,
        houseNickname,
        maxGuests,
        bedroomCount,
        bedCount,
        amenities,
        housePhotos,
        availableExperiences,
        accommodationFee
      };

      const host = await this.hostService.registerHost(hostData);
      res.status(201).json({
        success: true,
        message: 'Host 등록이 완료되었습니다.',
        data: host
      });
    } catch (e) { 
      next(e); 
    }
  }

  async getAllHosts(req, res, next) {
    try {
      const hosts = await this.hostService.getAllHosts();
      res.status(200).json({
        success: true,
        data: hosts
      });
    } catch (e) { 
      next(e); 
    }
  }

  /**
   * Host 삭제
   * @param {string} hostId - 삭제할 호스트 ID
   */
  async deleteHost(req, res, next) {
    try {
      const { hostId } = req.params;
      
      if (!hostId) {
        return res.status(400).json({
          success: false,
          error: '호스트 ID가 필요합니다.'
        });
      }

      console.log('호스트 삭제 요청:', hostId);
      
      const deletedHost = await this.hostService.deleteHost(hostId);
      
      if (!deletedHost) {
        return res.status(404).json({
          success: false,
          error: '삭제할 호스트를 찾을 수 없습니다.'
        });
      }

      res.status(200).json({
        success: true,
        message: '호스트가 성공적으로 삭제되었습니다.',
        data: {
          deletedHostId: hostId,
          deletedHost: deletedHost
        }
      });
    } catch (e) {
      console.error('호스트 삭제 중 오류 발생:', e);
      next(e);
    }
  }

  /**
   * 특정 Host 조회
   * @param {string} hostId - 조회할 호스트 ID
   */
  async getHostById(req, res, next) {
    try {
      const { hostId } = req.params;
      
      if (!hostId) {
        return res.status(400).json({
          success: false,
          error: '호스트 ID가 필요합니다.'
        });
      }

      const host = await this.hostService.getHostById(hostId);
      
      if (!host) {
        return res.status(404).json({
          success: false,
          error: '호스트를 찾을 수 없습니다.'
        });
      }

      res.status(200).json({
        success: true,
        data: host
      });
    } catch (e) {
      next(e);
    }
  }

  /**
   * Kakao Maps Geocoding API Proxy
   * @param {string} address - 지오코딩할 주소
   */
  async geocoding(req, res, next) {
    try {
      const { address } = req.query;
      
      if (!address) {
        return res.status(400).json({
          success: false,
          message: '주소를 입력해주세요.'
        });
      }

      // API 키 검증
      if (!process.env.KAKAO_REST_API_KEY) {
        console.error('❌ KAKAO_REST_API_KEY가 설정되지 않음');
        return res.status(500).json({
          success: false,
          message: 'Kakao REST API 키가 설정되지 않았습니다.'
        });
      }
      
      console.log('🔍 카카오 지오코딩 요청:', address);
      console.log('🔑 Kakao API 키 상태: 설정됨');
      
      // Kakao Local Search API 호출
      const response = await axios.get('https://dapi.kakao.com/v2/local/search/address.json', {
        params: {
          query: address
        },
        headers: {
          'Authorization': `KakaoAK ${process.env.KAKAO_REST_API_KEY}`
        },
        timeout: 10000 // 10초 타임아웃
      });

      const { data } = response;
      
      console.log('📍 Kakao API 응답:', {
        총_결과_수: data.meta?.total_count || 0,
        현재_페이지_결과_수: data.documents?.length || 0
      });
      
      if (data.documents && data.documents.length > 0) {
        const result = data.documents[0];
        
        const geocodingResult = {
          address: address,
          formattedAddress: result.address_name,
          roadAddress: result.road_address_name || result.address_name,
          latitude: parseFloat(result.y),
          longitude: parseFloat(result.x),
          addressType: result.address_type
        };

        console.log('✅ 카카오 지오코딩 성공:', {
          input: address,
          formatted: result.address_name,
          road: result.road_address_name,
          lat: result.y,
          lng: result.x
        });
        
        res.json({
          success: true,
          data: geocodingResult
        });
      } else {
        console.log('❌ 카카오 지오코딩 결과 없음:', {
          input: address,
          total_count: data.meta?.total_count
        });
        
        res.status(404).json({
          success: false,
          message: `검색 결과가 없습니다. "${address}"에 대한 정확한 주소를 확인해주세요.`,
          input: address
        });
      }
    } catch (error) {
      console.error('❌ 카카오 지오코딩 API 오류:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        data: error.response?.data
      });
      
      // 네트워크 오류에 따른 사용자 친화적 메시지
      let userMessage = '카카오 지오코딩 요청 처리 중 오류가 발생했습니다.';
      let statusCode = 500;
      
      if (error.response?.status === 400) {
        userMessage = '잘못된 요청입니다. 주소 형식을 확인해주세요.';
        statusCode = 400;
      } else if (error.response?.status === 401) {
        userMessage = 'Kakao API 키가 유효하지 않습니다.';
        statusCode = 401;
      } else if (error.response?.status === 403) {
        userMessage = 'Kakao API 접근이 거부되었습니다. API 키를 확인해주세요.';
        statusCode = 403;
      } else if (error.response?.status === 429) {
        userMessage = 'API 사용량 한도를 초과했습니다. 잠시 후 다시 시도해주세요.';
        statusCode = 429;
      } else if (error.response?.status >= 500) {
        userMessage = 'Kakao 서버에 일시적 문제가 있습니다. 잠시 후 다시 시도해주세요.';
        statusCode = 500;
      } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
        userMessage = '네트워크 연결을 확인해주세요.';
        statusCode = 503;
      } else if (error.code === 'ETIMEDOUT') {
        userMessage = '요청 시간이 초과되었습니다. 다시 시도해주세요.';
        statusCode = 408;
      }
      
      res.status(statusCode).json({
        success: false,
        message: userMessage,
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = HostController;
