const UserRepository = require('../repositories/UserRepository');

class UserService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async getAllUsers() {
    const users = await this.userRepository.findAll();
    return users.map(user => user.toSafeObject());
  }

  async getUserById(id) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }
    return user.toSafeObject();
  }

  async updateUser(id, updateData) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    const updatedUser = await this.userRepository.updateUser(id, updateData);
    return updatedUser.toSafeObject();
  }

  async deleteUser(id) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    await this.userRepository.deleteUser(id);
    return true;
  }
}

module.exports = UserService;