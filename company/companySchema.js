var mongoose = require('mongoose');
var shortId = require('shortid');

var companySchema = new mongoose.Schema({
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
  info: {
    type: String
  },
  image: {
    type: String
  },
  email: {
    type: String
  },
  phone: {
    type: String
  },
  location: {
    type: [
      {
        type: String,
        ref: 'Location'
      }
    ]
  },
  industry: {
    type: [
      {
        type: String,
        ref: 'Industry'
      }
    ]
  }
});

companySchema.pre('save', function (next) {
  var self = this;
  if (self.updatedAt) {
    self.updatedAt = new Date();
  }
  next();
  return;
});

var Company = mongoose.model('Company', companySchema);

module.exports = Company;
