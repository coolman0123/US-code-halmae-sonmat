const HostRepository = require('../repositories/HostRepository');
const Host = require('../entities/Host');

class HostService {
  constructor() { 
    this.hostRepository = new HostRepository(); 
  }

  async registerHost(hostData) {
    try {
      // Host 엔티티로 데이터 검증 및 생성
      const host = new Host(hostData);
      
      // 집 닉네임 중복 체크
      const existingHost = await this.hostRepository.findByHouseNickname(host.houseNickname);
      if (existingHost) {
        throw new Error('이미 사용 중인 집 닉네임입니다.');
      }

      // Host 등록
      const registeredHost = await this.hostRepository.create(host);
      
      return registeredHost;
    } catch (error) {
      throw error;
    }
  }

  async getAllHosts() { 
    return await this.hostRepository.findAll(); 
  }

  async getHostByHouseNickname(houseNickname) {
    return await this.hostRepository.findByHouseNickname(houseNickname);
  }

  async getHostById(id) {
    return await this.hostRepository.findById(id);
  }

  async deleteHost(hostId) {
    try {
      // 먼저 호스트가 존재하는지 확인
      const existingHost = await this.hostRepository.findById(hostId);
      if (!existingHost) {
        throw new Error('삭제할 호스트를 찾을 수 없습니다.');
      }

      console.log('호스트 삭제 중:', existingHost);

      // 호스트 삭제
      const deletedResult = await this.hostRepository.delete(hostId);
      
      return { ...deletedResult, deletedHost: existingHost };
    } catch (error) {
      console.error('HostService.deleteHost 오류:', error);
      throw error;
    }
  }
}

module.exports = HostService;
