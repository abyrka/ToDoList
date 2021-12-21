const createError = require("http-errors");
const express = require("express");
const mongoose = require("mongoose");
const { StatusCodes } = require("http-status-codes");

const { initCacheClient } = require("./utils/cache");
const { mongoDbUrl } = require("./constants/urls");

const file = require("./routes/file");
const toDoItem = require("./routes/toDoItem");
const user = require("./routes/user");

mongoose.connect(mongoDbUrl, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection
  .once("open", () => console.log("Connected to database"))
  .on("error", (err) => console.log("Connection to database failed!!", err));

const app = express();

app.use(express.json());
//app.use(upload.array());
app.use(
  express.urlencoded({
    extended: false,
  })
);

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

app.use("/file", file);
app.use("/to-do-list", toDoItem);
app.use("/user", user);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(StatusCodes.NOT_FOUND));
});

// error handler
app.use(function (err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = err;

  // render the error page
  res.status(err.status || StatusCodes.INTERNAL_SERVER_ERROR);
  res.render("error");
});

initCacheClient();

module.exports = app;
