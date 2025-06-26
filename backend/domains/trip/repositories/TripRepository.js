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

}

module.exports = TripRepository;