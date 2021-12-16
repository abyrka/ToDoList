const express = require("express");
const ToDoItem = require("../models/toDoItem");

const router = express.Router();
const successStatusCode = 200;
const notFoundStatusCode = 404;

router.post("/create", function (req, res) {
  const item = {
    text: req.body.text,
    complete: false,
    userId: req.body.userId,
  };

  const data = new ToDoItem(item);
  data.save();
  res.send(data._id);
});

router.put("/update", function (req, res) {
  const id = req.body.id;

  ToDoItem.findById(id, function (err, doc) {
    if (!err && doc) {
      doc.text = req.body.text;
      doc.save();
      res.sendStatus(successStatusCode);
    } else {
      res.sendStatus(notFoundStatusCode);
    }
  });
});

router.delete("/delete", function (req, res) {
  const id = req.body.id;
  ToDoItem.findByIdAndRemove(id).exec();
  res.sendStatus(successStatusCode);
});

router.put("/complete", function (req, res) {
  const id = req.body.id;

  ToDoItem.findById(id, function (err, doc) {
    if (!err && doc) {
      doc.complete = req.body.complete;
      doc.save();
      res.sendStatus(successStatusCode);
    } else {
      res.sendStatus(notFoundStatusCode);
    }
  });
});

module.exports = router;
