const mongoose = require("mongoose");

const collections = require("../constants/collections");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    login: {
      type: String,
      required: true,
    },
  },
  {
    collection: collections.User,
  }
);

const User = mongoose.model(collections.User, userSchema);

module.exports = User;
