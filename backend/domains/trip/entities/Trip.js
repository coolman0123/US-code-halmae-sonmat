class Trip {
  constructor({ 
    id, 
    hostId, 
    title, 
    description, 
    location, 
    startDate, 
    endDate, 
    maxParticipants, 
    currentParticipants = 0,
    price, 
    included, 
    excluded,
    itinerary,
    status = 'active', // active, cancelled, completed 셋으로
    createdAt, 
    updatedAt 
  }) {
    this.id = id;
    this.hostId = hostId;
    this.title = title;
    this.description = description;
    this.location = location;
    this.startDate = startDate;
    this.endDate = endDate;
    this.maxParticipants = maxParticipants;
    this.currentParticipants = currentParticipants;
    this.price = price;
    this.included = included || [];
    this.excluded = excluded || [];
    this.itinerary = itinerary || [];
    this.status = status;
    this.createdAt = createdAt ?? new Date();
    this.updatedAt = updatedAt ?? new Date();
    this.validate();
  }

}

module.exports = Trip;