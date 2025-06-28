const UserRepository = require('../../user/repositories/UserRepository');

class AuthService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async register(userData) {
    const { email, password, name, phone } = userData;
    console.log('📝 회원가입 시도:', { email, name, phone });

    // 이미 존재하는 이메일인지 확인
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      console.log('❌ 이미 존재하는 이메일:', email);
      throw new Error('이미 존재하는 이메일입니다.');
    }

    // 사용자 생성 (보안은 신경쓰지 않으므로 비밀번호 그대로 저장)
    const newUser = await this.userRepository.createUser({
      email,
      password,
      name,
      phone
    });

    console.log('✅ 회원가입 성공:', { id: newUser.id, email: newUser.email, name: newUser.name });
    return newUser.toSafeObject();
  }

  async login(email, password) {
    console.log('🔍 로그인 시도:', { email, password });
    
    const user = await this.userRepository.findByEmail(email);
    console.log('👤 찾은 사용자:', user ? { id: user.id, email: user.email, name: user.name } : null);
    
    if (!user) {
      console.log('❌ 사용자를 찾을 수 없음:', email);
      throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
    }
    
    if (user.password !== password) {
      console.log('❌ 비밀번호 불일치:', { 입력된비밀번호: password, 저장된비밀번호: user.password });
      throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
    }

    console.log('✅ 로그인 성공:', user.email);
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