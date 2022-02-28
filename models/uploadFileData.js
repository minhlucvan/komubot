const mongoose = require('mongoose');

const uploadFiledb = new mongoose.Schema({
  filePath: { type: String, required: true },
  fileName: { type: String, required: true },
  createdTimestamp: { type: mongoose.Decimal128, required: false },
});

module.exports = mongoose.model('komu_uploadFile', uploadFiledb);
