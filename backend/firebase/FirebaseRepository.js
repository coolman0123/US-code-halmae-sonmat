const admin = require('./admin');

class FirebaseRepository {
  constructor(collectionName) {
    this.collectionName = collectionName;
    this.collection = admin.firestore().collection(collectionName);
    console.log(`🗄️ Firebase Repository 생성: ${collectionName}`);
  }

  async create(data) {
    try {
      console.log(`📝 Firebase에 데이터 생성 시도 [${this.collectionName}]:`, data);
      
      const docRef = await this.collection.add({
        ...data,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      const result = { id: docRef.id, ...data };
      console.log(`✅ Firebase 데이터 생성 성공 [${this.collectionName}]:`, { id: docRef.id });
      
      return result;
    } catch (error) {
      console.error(`❌ Firebase 데이터 생성 실패 [${this.collectionName}]:`, error.message);
      throw error;
    }
  }

  async findAll() {
    try {
      console.log(`🔍 Firebase 데이터 조회 시도 [${this.collectionName}]`);
      
      const snapshot = await this.collection.get();
      const result = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      console.log(`✅ Firebase 데이터 조회 성공 [${this.collectionName}]:`, result.length, '개 문서');
      
      return result;
    } catch (error) {
      console.error(`❌ Firebase 데이터 조회 실패 [${this.collectionName}]:`, error.message);
      throw error;
    }
  }

  // 필요에 따라 findById, update 등 추가
}

module.exports = FirebaseRepository;
