const FirebaseRepository = require('../../../firebase/FirebaseRepository');
const User = require('../entities/User');

class UserRepository extends FirebaseRepository {
  constructor() {
    super('users');
  }

  async findAll() {
    const snapshot = await this.collection.get();
    return snapshot.docs.map(doc => new User({ id: doc.id, ...doc.data() }));
  }

  async findByEmail(email) {
    const snapshot = await this.collection.where('email', '==', email).get();
    if (snapshot.empty) return null;
    
    const doc = snapshot.docs[0];
    return new User({ id: doc.id, ...doc.data() });
  }

  async createUser(userData) {
    const docRef = await this.collection.add({
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    return new User({ id: docRef.id, ...userData });
  }

  async findById(id) {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) return null;
    
    return new User({ id: doc.id, ...doc.data() });
  }

  async updateUser(id, updateData) {
    await this.collection.doc(id).update({
      ...updateData,
      updatedAt: new Date()
    });
    
    return this.findById(id);
  }

  async deleteUser(id) {
    await this.collection.doc(id).delete();
    return true;
  }
}

module.exports = UserRepository;