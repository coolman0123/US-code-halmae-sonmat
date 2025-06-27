const FirebaseRepository = require('../../../firebase/FirebaseRepository.js'); 
const admin = require('../../../firebase/admin.js'); 
const Host = require('../entities/Host.js'); 

class HostRepository extends FirebaseRepository {
  constructor() {
    super('hosts');
  }

async create(hostData) {
  const host = new Host(hostData); // createdAt/updatedAt 자동 처리
  const obj = host.toJSON();
  delete obj.id; // Firestore에 저장 시 id 제거
  const docRef = await this.collection.add(obj);
  return { id: docRef.id, ...obj }; // 응답에는 id 포함
}


  async findAll() {
  const snapshot = await this.collection.get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

  async findById(id) {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) {
      throw new Error('호스트를 찾을 수 없습니다.');
    }
    return { id: doc.id, ...doc.data() };
  }

  async findByHouseNickname(houseNickname) {
    const snapshot = await this.collection
      .where('houseNickname', '==', houseNickname)
      .get();
    
    if (snapshot.empty) {
      return null;
    }
    
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  }

  async update(id, updateData) {
    updateData.updatedAt = new Date();
    await this.collection.doc(id).update(updateData);
    return this.findById(id);
  }

  async delete(id) {
    await this.collection.doc(id).delete();
    return { success: true, message: '호스트가 삭제되었습니다.' };
  }
}

module.exports = HostRepository;

