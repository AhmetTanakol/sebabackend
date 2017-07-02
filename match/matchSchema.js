var mongoose = require('mongoose');
var shortId = require('shortid');

var matchSchema = new mongoose.Schema({
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
  company: {
    type: String,
    ref: 'Company'
  },
  refugee: {
    type: String,
    ref: 'Refugee'
  },
  job: {
    type: String,
    ref: 'Job'
  }
});

matchSchema.pre('save', function (next) {
  var self = this;
  if (self.updatedAt) {
    self.updatedAt = new Date();
  }
  next();
  return;
});

var Match = mongoose.model('Match', matchSchema);

module.exports = Match;
