var mongoose = require('mongoose');
var shortId = require('shortid');

var experienceSchema = new mongoose.Schema({
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
  refugee: {
    type: String,
    ref: 'Refugee'
  },
  companyName: {
    type: String
  },
  companyLocation: {
    type: String
  },
  title: {
    type: String
  },
  from: {
    type: Date
  },
  to: {
    type: Date
  },
  description: {
    type: String
  }
});

experienceSchema.pre('save', function (next) {
  var self = this;
  if (self.updatedAt) {
    self.updatedAt = new Date();
  }
  next();
  return;
});

var Experience = mongoose.model('Experience', experienceSchema);

module.exports = Experience;
