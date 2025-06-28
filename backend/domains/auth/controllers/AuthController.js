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

      // 간단한 토큰 생성 (보안 무시, 단순 구현)
      const token = Buffer.from(`${user.id}:${user.email}:${Date.now()}`).toString('base64');

      console.log('✅ 로그인 API 성공:', { userId: user.id, email: user.email, token });
      res.json({
        success: true,
        message: '로그인 성공',
        data: user,
        token: token
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
      // 토큰 기반에서는 클라이언트에서 토큰을 삭제하면 됨
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
      // Authorization 헤더에서 토큰 추출
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          success: false,
          message: '로그인이 필요합니다.'
        });
      }

      const token = authHeader.split(' ')[1];
      
      // 토큰 디코딩 (간단한 방식)
      try {
        const decoded = Buffer.from(token, 'base64').toString('utf-8');
        const [userId, email] = decoded.split(':');
        
        if (!userId) {
          throw new Error('유효하지 않은 토큰');
        }

        const user = await this.authService.getUserById(userId);

        res.json({
          success: true,
          data: user
        });
      } catch (tokenError) {
        console.log('❌ 토큰 디코딩 실패:', tokenError.message);
        return res.status(401).json({
          success: false,
          message: '유효하지 않은 토큰입니다.'
        });
      }
    } catch (error) {
      console.log('❌ getCurrentUser 에러:', error.message);
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  // 토큰 유효성 검사를 위한 엔드포인트
  async validateToken(req, res) {
    try {
      // Authorization 헤더에서 토큰 추출
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          success: false,
          message: '토큰이 없습니다.'
        });
      }

      const token = authHeader.split(' ')[1];
      
      // 토큰 디코딩 (간단한 방식)
      try {
        const decoded = Buffer.from(token, 'base64').toString('utf-8');
        const [userId, email] = decoded.split(':');
        
        if (!userId) {
          throw new Error('유효하지 않은 토큰');
        }

        const user = await this.authService.getUserById(userId);

        res.json({
          success: true,
          data: user
        });
      } catch (tokenError) {
        console.log('❌ 토큰 검증 실패:', tokenError.message);
        return res.status(401).json({
          success: false,
          message: '유효하지 않은 토큰입니다.'
        });
      }
    } catch (error) {
      res.status(401).json({
        success: false,
        message: '토큰 검증에 실패했습니다.'
      });
    }
  }
}

module.exports = AuthController; 