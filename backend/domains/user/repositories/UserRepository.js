const User = require('../entities/User');

// 메모리 기반 사용자 저장소 (개발용)
class UserRepository {
  constructor() {
    // 메모리에 사용자 데이터 저장
    this.users = [
      // 테스트용 사용자 미리 생성
      {
        id: '1',
        email: 'user@naver.com',
        password: '0000',
        name: '테스트 사용자',
        phone: '010-1234-5678',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2', 
        email: 'admin@test.com',
        password: '0000',
        name: '관리자',
        phone: '010-9999-9999',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    this.nextId = 3;
  }

  async findAll() {
    return this.users.map(userData => new User(userData));
  }

  async findByEmail(email) {
    const userData = this.users.find(user => user.email === email);
    if (!userData) return null;
    
    return new User(userData);
  }

  async createUser(userData) {
    const newUser = {
      id: this.nextId.toString(),
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.users.push(newUser);
    this.nextId++;
    
    console.log('✅ 새 사용자 생성:', newUser);
    console.log('📝 현재 저장된 사용자들:', this.users.map(u => ({ id: u.id, email: u.email, name: u.name })));
    
    return new User(newUser);
  }

  async findById(id) {
    const userData = this.users.find(user => user.id === id);
    if (!userData) return null;
    
    return new User(userData);
  }

  async updateUser(id, updateData) {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) return null;
    
    this.users[userIndex] = {
      ...this.users[userIndex],
      ...updateData,
      updatedAt: new Date()
    };
    
    return new User(this.users[userIndex]);
  }

  async deleteUser(id) {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) return false;
    
    this.users.splice(userIndex, 1);
    return true;
  }
}

module.exports = UserRepository;