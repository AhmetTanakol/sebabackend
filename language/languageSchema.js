var mongoose = require('mongoose');
var shortId = require('shortid');

var languageSchema = new mongoose.Schema({
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
    type: String
  }
});

languageSchema.pre('save', function (next) {
  var self = this;
  if (self.updatedAt) {
    self.updatedAt = new Date();
  }
  next();
  return;
});

var Language = mongoose.model('Language', languageSchema);

module.exports = Language;
