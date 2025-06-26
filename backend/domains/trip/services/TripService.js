const TripRepository = require('../repositories/TripRepository');
const HostRepository = require('../../host/repositories/HostRepository');
const UserRepository = require('../../user/repositories/UserRepository');

class TripService {
  constructor() {
    this.tripRepository = new TripRepository();
    this.hostRepository = new HostRepository();
    this.userRepository = new UserRepository();
  }

  async createTrip(tripData) {
    try {
      // hostId 검증: Firebase에 실제 존재하는 host인지 확인
      if (!tripData.hostId) {
        throw new Error('호스트 ID는 필수입니다.');
      }
      
      const hostExists = await this.hostRepository.findById(tripData.hostId);
      if (!hostExists) {
        throw new Error('존재하지 않는 호스트 ID입니다.');
      }

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

  async updateTrip(id, updateData) {
    try {
      const existingTrip = await this.tripRepository.findById(id);
      if (!existingTrip) {
        throw new Error('여행을 찾을 수 없습니다.');
      }

      
      if (existingTrip.currentParticipants > 0) {
        const allowedFields = ['description', 'included', 'excluded', 'itinerary'];
        const filteredUpdate = {};
        Object.keys(updateData).forEach(key => {
          if (allowedFields.includes(key)) {
            filteredUpdate[key] = updateData[key];
          }
        });
        return await this.tripRepository.update(id, filteredUpdate);
      }

      return await this.tripRepository.update(id, updateData);
    } catch (error) {
      throw new Error(`여행 수정 중 오류가 발생했습니다: ${error.message}`);
    }
  }

  async deleteTrip(id) {
    try {
      const trip = await this.tripRepository.findById(id);
      if (!trip) {
        throw new Error('여행을 찾을 수 없습니다.');
      }

      if (trip.currentParticipants > 0) {
        throw new Error('참가자가 있는 여행은 삭제할 수 없습니다.');
      }

      return await this.tripRepository.delete(id);
    } catch (error) {
      throw new Error(`여행 삭제 중 오류가 발생했습니다: ${error.message}`);
    }
  }
    
    async joinTrip(tripId, email) {
    try {
      // Firestore users 컬렉션의 email 필드와 매칭 검증
      if (!email) {
        throw new Error('사용자 이메일은 필수입니다.');
      }
      
      const userExists = await this.userRepository.findByEmail(email);
      if (!userExists) {
        throw new Error('등록되지 않은 사용자 이메일입니다.');
      }

      const trip = await this.tripRepository.findById(tripId);
      if (!trip) {
        throw new Error('여행을 찾을 수 없습니다.');
      }

      if (trip.status !== 'active') {
        throw new Error('참가할 수 없는 여행입니다.');
      }

      if (trip.currentParticipants >= trip.maxParticipants) {
        throw new Error('참가 인원이 마감되었습니다.');
      }

      // 참가자 목록에 email 추가
      const participants = trip.participants || [];
      if (participants.includes(email)) {
        throw new Error('이미 참가 신청한 여행입니다.');
      }
      
      participants.push(email);
      const newParticipantCount = trip.currentParticipants + 1;
      
      return await this.tripRepository.updateParticipants(tripId, participants, newParticipantCount);
    } catch (error) {
      throw new Error(`여행 참가 중 오류가 발생했습니다: ${error.message}`);
    }
  }

  async leaveTrip(tripId, email) {
    try {
      // Firestore users 컬렉션의 email 필드와 매칭 검증
      if (!email) {
        throw new Error('사용자 이메일은 필수입니다.');
      }

      const userExists = await this.userRepository.findByEmail(email);
      if (!userExists) {
        throw new Error('등록되지 않은 사용자 이메일입니다.');
      }

      const trip = await this.tripRepository.findById(tripId);
      if (!trip) {
        throw new Error('여행을 찾을 수 없습니다.');
      }

      const participants = trip.participants || [];
      if (!participants.includes(email)) {
        throw new Error('참가하지 않은 여행입니다.');
      }

      // 참가자 목록에서 email 제거
      const updatedParticipants = participants.filter(participantEmail => participantEmail !== email);
      const newParticipantCount = Math.max(0, trip.currentParticipants - 1);
      
      return await this.tripRepository.updateParticipants(tripId, updatedParticipants, newParticipantCount);
    } catch (error) {
      throw new Error(`여행 참가 취소 중 오류가 발생했습니다: ${error.message}`);
    }
  }

  async cancelTrip(id) {
    try {
      const trip = await this.tripRepository.findById(id);
      if (!trip) {
        throw new Error('여행을 찾을 수 없습니다.');
      }

      return await this.tripRepository.update(id, { status: 'cancelled' });
    } catch (error) {
      throw new Error(`여행 취소 중 오류가 발생했습니다: ${error.message}`);
    }
  }


}

module.exports = TripService;