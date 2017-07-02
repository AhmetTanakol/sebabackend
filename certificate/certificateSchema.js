var mongoose = require('mongoose');
var shortId = require('shortid');

var certificateSchema = new mongoose.Schema({
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
  title: {
    type: String
  },
  from: {
    type: Date
  },
  to: {
    type: Date
  },
  photo: {
    type: String
  },
  description: {
    type: String
  }
});

certificateSchema.pre('save', function (next) {
  var self = this;
  if (self.updatedAt) {
    self.updatedAt = new Date();
  }
  next();
  return;
});

var Certificate = mongoose.model('Certificate', certificateSchema);

module.exports = Certificate;
