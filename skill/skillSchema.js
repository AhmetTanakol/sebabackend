var mongoose = require('mongoose');
var shortId = require('shortid');

var skillSchema = new mongoose.Schema({
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

var Skill = mongoose.model('Skill', skillSchema);

module.exports = Skill;
