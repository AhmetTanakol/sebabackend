var mongoose = require('mongoose');
var shortId = require('shortid');

var jobSchema = new mongoose.Schema({
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
  description: {
    type: String
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  applicants: {
    type: [
      {
        type: String,
        ref: 'Refugee'
      }
    ]
  },
  skills: {
    type: [
      {
        type: String,
        ref: 'Skill'
      }
    ]
  }
});

jobSchema.pre('save', function (next) {
  var self = this;
  if (self.updatedAt) {
    self.updatedAt = new Date();
  }
  next();
  return;
});

var Job = mongoose.model('Job', jobSchema);

module.exports = Job;
