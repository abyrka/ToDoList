const mongoose = require("mongoose");

const collections = require("../constants/collections");

const Schema = mongoose.Schema;

const fileSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    itemId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    fileId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    collection: collections.File,
  }
);

const File = mongoose.model(collections.File, fileSchema);

module.exports = File;
