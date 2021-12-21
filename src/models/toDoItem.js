const mongoose = require("mongoose");

const collections = require("../constants/collections");

const Schema = mongoose.Schema;

const toDoItemSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
    },
    complete: {
      type: Boolean,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    collection: collections.ToDoItem,
  }
);

const ToDoItem = mongoose.model(collections.ToDoItem, toDoItemSchema);

module.exports = ToDoItem;
