const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name : String,
  price : Number,
  image : String,
  category : String,
  isAvailable : Boolean
});

module.exports = mongoose.model("Item",itemSchema);