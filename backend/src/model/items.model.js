const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name : {
    type : String,
    required : true
  },
  price : {
    type : Number,
    required : true
  },
  image : {
    type : String,
    required : true
  },
  category : {
    type : String,
    required : true
  },
  isAvailable : {
    type : Boolean,
    default : true
  },
  isRemoved : {
    type : Boolean,
    default : false
  }
});

module.exports = mongoose.model("Item",itemSchema);