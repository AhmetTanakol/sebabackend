var mongoose = require('mongoose');
var shortId = require('shortid');

var wishlistSchema = new mongoose.Schema({
  _id: {
    type: String,
    unique: true,
    default: shortId.generate
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

wishlistSchema.pre('save', function (next) {
  var self = this;
  if (self.updatedAt) {
    self.updatedAt = new Date();
  }
  next();
  return;
});

var Wishlist = mongoose.model('wishlist', wishlistSchema);

module.exports = Wishlist;
