const FirebaseRepository = require('../../../firebase/FirebaseRepository.js');
const admin = require('../../../firebase/admin.js');
const Trip = require('../entities/Trip.js');

class TripRepository extends FirebaseRepository {
  constructor() {
    super('trips');
  }

  async create(tripData) {
    const trip = new Trip(tripData);
    const obj = trip.toJSON();
    delete obj.id; 
    const docRef = await this.collection.add(obj);
    return { id: docRef.id, ...obj };
  }

  async findAll() {
    const snapshot = await this.collection.orderBy('createdAt', 'desc').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async findById(id) {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  }

  async findByHostId(hostId) {
    const snapshot = await this.collection
      .where('hostId', '==', hostId)
      .orderBy('createdAt', 'desc')
      .get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async findByStatus(status) {
    const snapshot = await this.collection
      .where('status', '==', status)
      .orderBy('createdAt', 'desc')
      .get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async findByLocation(region) {
    const snapshot = await this.collection
      .where('location.region', '==', region)
      .orderBy('createdAt', 'desc')
      .get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async update(id, updateData) {
    const updateObj = {
      ...updateData,
      updatedAt: new Date()
    };
    await this.collection.doc(id).update(updateObj);
    return this.findById(id);
  }

  async delete(id) {
    await this.collection.doc(id).delete();
    return true;
  }

   async updateParticipantCount(id, currentParticipants) {
    await this.collection.doc(id).update({
      currentParticipants,
      updatedAt: new Date()
    });
    return this.findById(id);
  }

  async updateParticipants(id, participants, currentParticipants) {
    await this.collection.doc(id).update({
      participants,
      currentParticipants,
      updatedAt: new Date()
    });
    return this.findById(id);
  }

}

module.exports = TripRepository;