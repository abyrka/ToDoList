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
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    collection: "ToDoItem",
  }
);

const ToDoItem = mongoose.model("ToDoItem", toDoItemSchema);

module.exports = ToDoItem;
