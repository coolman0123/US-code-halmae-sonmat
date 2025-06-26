const TripRepository = require('../repositories/TripRepository');

class TripService {
  constructor() {
    this.tripRepository = new TripRepository();
  }

  async createTrip(tripData) {
    try {
      return await this.tripRepository.create(tripData);
    } catch (error) {
      throw new Error(`여행 생성 중 오류가 발생했습니다: ${error.message}`);
    }
  }

  async getAllTrips() {
    try {
      return await this.tripRepository.findAll();
    } catch (error) {
      throw new Error(`여행 목록 조회 중 오류가 발생했습니다: ${error.message}`);
    }
  }

  async getTripById(id) {
    try {
      const trip = await this.tripRepository.findById(id);
      if (!trip) {
        throw new Error('여행을 찾을 수 없습니다.');
      }
      return trip;
    } catch (error) {
      throw new Error(`여행 조회 중 오류가 발생했습니다: ${error.message}`);
    }
  }

  async getTripsByHostId(hostId) {
    try {
      return await this.tripRepository.findByHostId(hostId);
    } catch (error) {
      throw new Error(`호스트 여행 목록 조회 중 오류가 발생했습니다: ${error.message}`);
    }
  }

  async getActiveTrips() {
    try {
      return await this.tripRepository.findByStatus('active');
    } catch (error) {
      throw new Error(`활성 여행 목록 조회 중 오류가 발생했습니다: ${error.message}`);
    }
  }

  async getTripsByLocation(region) {
    try {
      return await this.tripRepository.findByLocation(region);
    } catch (error) {
      throw new Error(`지역별 여행 목록 조회 중 오류가 발생했습니다: ${error.message}`);
    }
  }

}

module.exports = TripService;