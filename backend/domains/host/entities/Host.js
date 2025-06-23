class Host {
  constructor({ id, name, age, location, contact, description, createdAt, updatedAt }) {
    this.id = id;
    this.name = name;
    this.age = age;
    this.location = location;
    this.contact = contact;
    this.description = description;
    this.createdAt = createdAt ?? new Date();  
    this.updatedAt = updatedAt ?? new Date();   
    this.validate();
  }
  validate() {
    if (!this.name) throw new Error('이름은 필수입니다.');
    if (!this.location || !this.location.region) throw new Error('지역 정보는 필수입니다.');
    if (!this.contact || !this.contact.phone) throw new Error('연락처는 필수입니다.');
  }
  toJSON() {
    const obj = { ...this };
    // undefined 값은 Firestore에 저장하지 않도록 필터링
    Object.keys(obj).forEach(key => {
      if (obj[key] === undefined) delete obj[key];
    });
    return obj;
  }
}
module.exports = Host;
