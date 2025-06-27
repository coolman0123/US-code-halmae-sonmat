const HostService = require('../services/HostService');
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
   * Google Maps Geocoding API Proxy
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

      const GOOGLE_MAPS_API_KEY = 'AIzaSyDCFpWL0RLVqqgnRJqVmpjec9pnw7DAHeo';
      
      console.log('🗺️ 지오코딩 요청:', address);
      
      // Google Geocoding API 호출
      const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          address: address,
          key: GOOGLE_MAPS_API_KEY,
          language: 'ko',
          region: 'KR',
          components: 'country:KR'
        }
      });

      const { data } = response;
      
      console.log('🔍 Google API 응답:', data.status, data.results?.length);
      
      if (data.status === 'OK' && data.results && data.results.length > 0) {
        const result = data.results[0];
        const location = result.geometry.location;
        
        const geocodingResult = {
          address: address,
          formattedAddress: result.formatted_address,
          latitude: location.lat,
          longitude: location.lng,
          placeId: result.place_id
        };

        console.log('✅ 지오코딩 성공:', geocodingResult);
        
        res.json({
          success: true,
          data: geocodingResult
        });
      } else {
        let errorMessage = '주소를 찾을 수 없습니다.';
        
        switch (data.status) {
          case 'ZERO_RESULTS':
            errorMessage = '검색 결과가 없습니다. 다른 주소로 시도해보세요.';
            break;
          case 'OVER_QUERY_LIMIT':
            errorMessage = 'API 사용량 한도를 초과했습니다.';
            break;
          case 'REQUEST_DENIED':
            errorMessage = 'API 요청이 거부되었습니다.';
            break;
          case 'INVALID_REQUEST':
            errorMessage = '잘못된 요청입니다.';
            break;
          case 'UNKNOWN_ERROR':
            errorMessage = '서버 오류가 발생했습니다.';
            break;
        }
        
        console.log('❌ 지오코딩 실패:', data.status, errorMessage);
        
        res.status(400).json({
          success: false,
          message: errorMessage,
          status: data.status
        });
      }
    } catch (error) {
      console.error('❌ 지오코딩 API 오류:', error.message);
      res.status(500).json({
        success: false,
        message: '지오코딩 요청 처리 중 오류가 발생했습니다.',
        error: error.message
      });
    }
  }
}

module.exports = HostController;
