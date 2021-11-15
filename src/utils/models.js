const mongoose = require("mongoose");

const mongoDbUrl = "mongodb://localhost/ToDoList";
mongoose.connect(mongoDbUrl, {
  useNewUrlParser: true,
});
/*
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("connect to mongo");
});
 */
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

module.exports.ToDoItem = ToDoItem;
module.exports.User = User;
