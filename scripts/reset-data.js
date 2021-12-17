const mongoose = require("mongoose");

const File = require("../src/models/file");
const ToDoItem = require("../src/models/toDoItem");
const User = require("../src/models/user");

(async () => {
  try {
    console.log("reset-data");

    const mongoDbUrl = "mongodb://localhost/ToDoList";
    mongoose.connect(mongoDbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("-- clear collection");
    await File.deleteMany({});
    await ToDoItem.deleteMany({});
    await User.deleteMany({});

    console.log("-- clear bucket with files");
    await deleteAllFiles();

    console.log("-- create user");
    const userData = new User({ login: "Mark" });
    userData.save();

    console.log("-- create todo item");
    const toDoItemData = new ToDoItem({
      text: "reset text",
      complete: false,
      userId: userData._id,
    });
    toDoItemData.save();
  } catch (error) {
    console.error(error);
  }
})();

async function deleteAllFiles() {
  const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: "FileStorage",
  });
  const documents = await bucket.find().toArray();
  if (documents.length === 0) {
    throw new Error("FileNotFound");
  }
  return Promise.all(
    documents.map((doc) => {
      return bucket.delete(doc._id);
    })
  );
}
