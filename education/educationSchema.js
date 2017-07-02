var mongoose = require('mongoose');
var shortId = require('shortid');

var educationSchema = new mongoose.Schema({
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
  school: {
    type: String
  },
  degree: {
    type: String
  },
  fieldOfStudy: {
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

educationSchema.pre('save', function (next) {
  var self = this;
  if (self.updatedAt) {
    self.updatedAt = new Date();
  }
  next();
  return;
});

var Education = mongoose.model('Education', educationSchema);

module.exports = Education;
