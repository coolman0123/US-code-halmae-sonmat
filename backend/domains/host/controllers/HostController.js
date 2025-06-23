const HostService = require('../services/HostService');
class HostController {
  constructor() { this.hostService = new HostService(); }
  async registerHost(req, res, next) {
    try {
      const host = await this.hostService.registerHost(req.body);
      res.status(201).json(host);
    } catch (e) { next(e); }
  }
  async getAllHosts(req, res, next) {
    try {
      const hosts = await this.hostService.getAllHosts();
      res.status(200).json(hosts);
    } catch (e) { next(e); }
  }
}
module.exports = HostController;
