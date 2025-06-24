class User {
  constructor(data) {
    this.id = data.id;
    this.email = data.email;
    this.password = data.password;
    this.name = data.name;
    this.phone = data.phone;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  // 비밀번호 제외한 안전한 사용자 정보 반환
  toSafeObject() {
    const { password, ...safeUser } = this;
    return safeUser;
  }
}

module.exports = User;