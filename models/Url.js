const mongoose = require('mongoose');

const UrlSchema = new mongoose.Schema({

  urlCode: {
    type: String,
    required: true
  },

  longUrl: {
    type: String,
    required: true
  },

  shortUrl: {
    type: String,
    required: true
  },

  expireAt: {
    type: Date,
    required: true
  },

  date: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model('Url', UrlSchema);