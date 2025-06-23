const admin = require('./admin');

class FirebaseRepository {
  constructor(collectionName) {
    this.collection = admin.firestore().collection(collectionName);
  }

  async create(data) {
    const docRef = await this.collection.add({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return { id: docRef.id, ...data };
  }

  async findAll() {
    const snapshot = await this.collection.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  // 필요에 따라 findById, update 등 추가
}

module.exports = FirebaseRepository;
