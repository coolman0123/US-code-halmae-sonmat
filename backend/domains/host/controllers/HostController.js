const HostService = require('../services/HostService');

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
}

module.exports = HostController;
