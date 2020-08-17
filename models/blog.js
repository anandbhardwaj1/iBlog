const mongoose = require("mongoose");

var blogSchema = mongoose.Schema({
  rating: {
    type: Number,default :0,
  },
  name: {
    type: String,
  },
  initialNode: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Node",
  },



  nodes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Node",
    },
  ],
});

module.exports = mongoose.model("Blog", blogSchema);
