const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const fileSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    itemId: {
      type: String,
      required: true,
    },
    fileId: {
      type: String,
      required: true,
    },
  },
  {
    collection: "File",
  }
);

const File = mongoose.model("File", fileSchema);

module.exports = File;
