const mongoose = require("mongoose");

const collections = require("../constants/collections");

const Schema = mongoose.Schema;

const attachmentSchema = new Schema(
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
    collection: collections.Attachment,
  }
);

const Attachment = mongoose.model(collections.Attachment, attachmentSchema);

module.exports = Attachment;
