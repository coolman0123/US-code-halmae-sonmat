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

   async getAllTrips(req, res, next) {
    try {
      const { status, region, hostId } = req.query;
      
      let trips;
      if (status) {
        trips = await this.tripService.getActiveTrips();
      } else if (region) {
        trips = await this.tripService.getTripsByLocation(region);
      } else if (hostId) {
        trips = await this.tripService.getTripsByHostId(hostId);
      } else {
        trips = await this.tripService.getAllTrips();
      }

      res.status(200).json({
        success: true,
        data: trips
      });
    } catch (error) {
      next(error);
    }
  }

  async getTripById(req, res, next) {
    try {
      const { id } = req.params;
      const trip = await this.tripService.getTripById(id);
      
      res.status(200).json({
        success: true,
        data: trip
      });
    } catch (error) {
      next(error);
    }
  }
  async updateTrip(req, res, next) {
    try {
      const { id } = req.params;
      const trip = await this.tripService.updateTrip(id, req.body);
      
      res.status(200).json({
        success: true,
        message: '여행 정보가 수정되었습니다.',
        data: trip
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteTrip(req, res, next) {
    try {
      const { id } = req.params;
      await this.tripService.deleteTrip(id);
      
      res.status(200).json({
        success: true,
        message: '여행이 삭제되었습니다.'
      });
    } catch (error) {
      next(error);
    }
  }
  async joinTrip(req, res, next) {
    try {
      const { id } = req.params;
      const trip = await this.tripService.joinTrip(id);
      
      res.status(200).json({
        success: true,
        message: '여행 참가 신청이 완료되었습니다.',
        data: trip
      });
    } catch (error) {
      next(error);
    }
  }



}

module.exports = TripController;