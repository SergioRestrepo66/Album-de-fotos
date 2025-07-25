const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  imageUrl: { type: String, required: true },
}, { collection: 'album' });

module.exports = mongoose.model('Album', albumSchema);

