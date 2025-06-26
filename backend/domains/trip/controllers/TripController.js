const TripService = require('../services/TripService');

class TripController {
  constructor() {
    this.tripService = new TripService();
  }

  async createTrip(req, res, next) {
    try {
      const trip = await this.tripService.createTrip(req.body);
      res.status(201).json({
        success: true,
        message: '여행이 성공적으로 등록되었습니다.',
        data: trip
      });
    } catch (error) {
      next(error);
    }
  }

}

module.exports = TripController;