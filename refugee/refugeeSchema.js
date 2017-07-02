var mongoose = require('mongoose');
var shortId = require('shortid');

var refugeeSchema = new mongoose.Schema({
  _id: {
    type: String,
    unique: true,
    default: shortId.generate
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  gender: {
    type: String
  },
  dateOfBirth: {
    type: Date
  },
  placeOfBirth: {
    type: String
  },
  maritalStatus: {
    type: String
  },
  language: {
    type: [
      {
        type: String,
        ref: 'Language'
      }
    ]
  },
  photo: {
    type: String
  },
  city: {
    type: String,
    ref: 'Location'
  },
  skills: {
    type: [
      {
        type: String,
        ref: 'Skill'
      }
    ]
  },
  certificates: {
    type: [
      {
        type: String,
        ref: 'Certificate'
      }
    ]
  },
  education: {
    type: [
      {
        type: String,
        ref: 'Education'
      }
    ]
  },
  experience: {
    type: [
      {
        type: String,
        ref: 'Experience'
      }
    ]
  },
  address: {
    type: String
  },
  postalCode: {
    type: Number
  },
  phone: {
    type: String
  },
  email: {
    type: String
  }
});

var Refugee = mongoose.model('Refugee', refugeeSchema);

module.exports = Refugee;
