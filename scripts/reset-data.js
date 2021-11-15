const models = require("../src/utils/models.js");

const User = models.User;
const ToDoItem = models.ToDoItem;
console.log("11reset-data");

const userData = new User({ login: "Mark" });
userData.save();

const toDoItemData = new ToDoItem({
  text: "reset text",
  complete: false,
  userId: userData._id,
});
toDoItemData.save();
