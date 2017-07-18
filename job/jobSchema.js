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
<<<<<<< HEAD
    type: [
      {
        type: String,
        ref: 'Skill'
      }
    ]
=======
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
>>>>>>> d4dc9b4fe801f9c63316054deb1c870cb51ea9e1
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
