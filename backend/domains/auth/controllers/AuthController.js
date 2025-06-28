const AuthService = require('../services/AuthService');

class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  async register(req, res) {
    try {
      console.log('📝 회원가입 API 호출:', req.body);
      const { email, password, name, phone } = req.body;

      if (!email || !password || !name || !phone) {
        console.log('❌ 필수 필드 누락:', { email: !!email, password: !!password, name: !!name, phone: !!phone });
        return res.status(400).json({
          success: false,
          message: '모든 필드를 입력해주세요.'
        });
      }

      const user = await this.authService.register({ email, password, name, phone });

      console.log('✅ 회원가입 API 성공:', { userId: user.id, email: user.email });
      res.status(201).json({
        success: true,
        message: '회원가입이 완료되었습니다.',
        data: user
      });
    } catch (error) {
      console.log('❌ 회원가입 API 에러:', error.message);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async login(req, res) {
    try {
      console.log('🚀 로그인 API 호출:', req.body);
      const { email, password } = req.body;

      if (!email || !password) {
        console.log('❌ 이메일 또는 비밀번호 누락');
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

      console.log('✅ 로그인 API 성공:', { userId: user.id, email: user.email });
      res.json({
        success: true,
        message: '로그인 성공',
        data: user
      });
    } catch (error) {
      console.log('❌ 로그인 API 에러:', error.message);
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

  // 토큰 유효성 검사를 위한 엔드포인트 (현재는 세션 기반)
  async validateToken(req, res) {
    try {
      if (!req.session || !req.session.userId) {
        return res.status(401).json({
          success: false,
          message: '유효하지 않은 세션입니다.'
        });
      }

      const user = await this.authService.getUserById(req.session.userId);

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: '세션이 만료되었습니다.'
      });
    }
  }
}

module.exports = AuthController; 