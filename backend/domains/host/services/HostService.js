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
}

module.exports = HostService;
