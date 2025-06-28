const UserRepository = require('../../user/repositories/UserRepository');

class AuthService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async register(userData) {
    const { email, password, name, phone } = userData;
    console.log('📝 AuthService 회원가입 시도:', { email, name, phone });

    try {
      // 이미 존재하는 이메일인지 확인
      console.log('🔍 이메일 중복 확인 중...');
      const existingUser = await this.userRepository.findByEmail(email);
      if (existingUser) {
        console.log('❌ 이미 존재하는 이메일:', email);
        throw new Error('이미 존재하는 이메일입니다.');
      }

      // 사용자 생성 (보안은 신경쓰지 않으므로 비밀번호 그대로 저장)
      console.log('👤 새 사용자 생성 중...');
      const newUser = await this.userRepository.createUser({
        email,
        password,
        name,
        phone
      });

      console.log('✅ AuthService 회원가입 성공:', { id: newUser.id, email: newUser.email, name: newUser.name });
      return newUser.toSafeObject();
    } catch (error) {
      console.error('❌ AuthService 회원가입 실패:', error.message);
      throw error;
    }
  }

  async login(email, password) {
    console.log('🔍 로그인 시도:', { email, password });
    
    // 이메일이 있는지만 확인 (비밀번호 검증 생략)
    const user = await this.userRepository.findByEmail(email);
    console.log('👤 찾은 사용자:', user ? { id: user.id, email: user.email, name: user.name } : null);
    
    if (!user) {
      console.log('❌ 사용자를 찾을 수 없음:', email);
      throw new Error('등록되지 않은 이메일입니다.');
    }
    
    // 비밀번호 검증 완전 생략 - 이메일만 맞으면 로그인 성공
    console.log('✅ 로그인 성공 (비밀번호 검증 생략):', user.email);
    return user.toSafeObject();
  }

  async getUserById(id) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }
    return user.toSafeObject();
  }
}

module.exports = AuthService; 