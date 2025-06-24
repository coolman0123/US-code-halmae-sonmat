const UserRepository = require('../../user/repositories/UserRepository');

class AuthService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async register(userData) {
    const { email, password, name, phone } = userData;

    // 이미 존재하는 이메일인지 확인
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('이미 존재하는 이메일입니다.');
    }

    // 사용자 생성 (보안은 신경쓰지 않으므로 비밀번호 그대로 저장)
    const newUser = await this.userRepository.createUser({
      email,
      password,
      name,
      phone
    });

    return newUser.toSafeObject();
  }

  async login(email, password) {
    const user = await this.userRepository.findByEmail(email);
    
    if (!user || user.password !== password) {
      throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
    }

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