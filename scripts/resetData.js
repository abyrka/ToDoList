const mongoose = require("mongoose");

const { mongoDbUrl } = require("../src/constants/urls");
const collections = require("../src/constants/collections");
const { clearAllCache } = require("../src/utils/cache");

const Attachment = require("../src/models/attachment");
const ToDoItem = require("../src/models/toDoItem");
const User = require("../src/models/user");

(async () => {
  try {
    console.log("Reset data");

    mongoose.connect(mongoDbUrl, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("-- clear collection");
    await Attachment.deleteMany({});
    await ToDoItem.deleteMany({});
    await User.deleteMany({});

    console.log("-- clear bucket with attachments");
    await deleteAllFiles();

    console.log("-- clear redis cache");
    clearAllCache();

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
    bucketName: collections.FileStorage,
  });
  const documents = await bucket.find().toArray();
  if (documents.length === 0) {
    return;
  }
  return Promise.all(
    documents.map((doc) => {
      return bucket.delete(doc._id);
    })
  );
}
