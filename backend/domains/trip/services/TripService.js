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

}

module.exports = TripService;