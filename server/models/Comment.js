const mongoose = require('mongoose');

const { Schema } = mongoose;

const commentSchema = new Schema({
  
  text: {
    type: String,
    required: false,
    trim: true
  },

  productId:{
    type: String,
    required: false,
    trim: true
  },

  

});

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
