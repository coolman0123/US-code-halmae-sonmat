const HostRepository = require('../repositories/HostRepository');
class HostService {
  constructor() { this.hostRepository = new HostRepository(); }
  async registerHost(hostData) { return await this.hostRepository.create(hostData); }
  async getAllHosts() { return await this.hostRepository.findAll(); }
}
module.exports = HostService;
