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
  title: {
    type: String
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
              name: {
                  type: String,
                  ref: 'Skill'
              },
              power: {
                  type: Number
              },
              _id: false
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