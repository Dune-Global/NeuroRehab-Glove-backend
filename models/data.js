const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const readingSchema = new Schema({
  readingNumber: Number,
  readingValue: String,
});

const dataSchema = new Schema({
  currentDateTime: {
    type: Date,
    default: Date.now,
    required: true,
  },
  readings: {
    type: [readingSchema],
    required: true,
  },
});

const Finger1 = mongoose.model("Finger1", dataSchema);
const Finger2 = mongoose.model("Finger2", dataSchema);
const Finger3 = mongoose.model("Finger3", dataSchema);
const Finger4 = mongoose.model("Finger4", dataSchema);
const Finger5 = mongoose.model("Finger5", dataSchema);
const Wrist = mongoose.model("Wrist", dataSchema);

module.exports = {
  Finger1,
  Finger2,
  Finger3,
  Finger4,
  Finger5,
  Wrist,
};
