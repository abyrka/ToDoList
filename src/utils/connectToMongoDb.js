const mongoose = require("mongoose");

const { mongoDbUrl } = require("../constants/urls");

function connectToMongoDb() {
  mongoose.connect(mongoDbUrl, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  mongoose.connection
    .once("open", () => console.log("Connected to database"))
    .on("error", (err) => console.log("Connection to database failed!!", err));
}

module.exports = connectToMongoDb;
