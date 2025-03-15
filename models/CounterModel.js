const mongoose = require("mongoose");

const CounterSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  value: { type: Number, default: 0 },
});

const CounterModel = mongoose.model("Counter", CounterSchema);

module.exports = CounterModel;
