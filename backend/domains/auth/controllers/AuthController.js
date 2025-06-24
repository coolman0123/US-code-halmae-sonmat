const AuthService = require('../services/AuthService');

class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  async register(req, res) {
    try {
      const { email, password, name, phone } = req.body;

      if (!email || !password || !name || !phone) {
        return res.status(400).json({
          success: false,
          message: '모든 필드를 입력해주세요.'
        });
      }

      const user = await this.authService.register({ email, password, name, phone });

      res.status(201).json({
        success: true,
        message: '회원가입이 완료되었습니다.',
        data: user
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: '이메일과 비밀번호를 입력해주세요.'
        });
      }

      const user = await this.authService.login(email, password);

      // 세션에 사용자 정보 저장 (간단한 방식)
      req.session = req.session || {};
      req.session.userId = user.id;
      req.session.user = user;

      res.json({
        success: true,
        message: '로그인 성공',
        data: user
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message
      });
    }
  }

  async logout(req, res) {
    try {
      // 세션 제거
      if (req.session) {
        req.session.userId = null;
        req.session.user = null;
      }

      res.json({
        success: true,
        message: '로그아웃 되었습니다.'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getCurrentUser(req, res) {
    try {
      if (!req.session || !req.session.userId) {
        return res.status(401).json({
          success: false,
          message: '로그인이 필요합니다.'
        });
      }

      const user = await this.authService.getUserById(req.session.userId);

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = AuthController; 