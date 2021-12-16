const createError = require("http-errors");
const express = require("express");
const mongoose = require("mongoose");

const toDoItem = require("./routes/toDoItem");
const user = require("./routes/user");

const mongoDbUrl = "mongodb://localhost/ToDoList";
mongoose.connect(mongoDbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const notFoundStatusCode = 404;
const internalServerErrorStatusCode = 500;
const app = express();

app.use(express.json());
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

app.use("/to-do-list", toDoItem);
app.use("/user", user);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(notFoundStatusCode));
});

// error handler
app.use(function (err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || internalServerErrorStatusCode);
  res.render("error");
});

module.exports = app;
