const mongoose = require("mongoose");

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
      type: String,
      required: true,
    },
  },
  {
    collection: "ToDoItem",
  }
);

const ToDoItem = mongoose.model("ToDoItem", toDoItemSchema);

module.exports = ToDoItem;
