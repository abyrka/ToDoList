const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    login: {
      type: String,
      required: true,
    },
  },
  {
    collection: "User",
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
