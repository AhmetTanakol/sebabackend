var mongoose = require('mongoose');
var shortId = require('shortid');

var baseSchema = new mongoose.Schema({
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
  }
});


baseSchema.pre('save', function (next) {
  var self = this;
  if (self.updatedAt) {
    self.updatedAt = new Date();
  }
  if (!self.isNew) {
    next();
    return;
  }
});

module.exports = baseSchema;
