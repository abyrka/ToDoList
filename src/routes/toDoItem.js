const express = require("express");
const models = require("../utils/models");

const router = express.Router();
const ToDoItem = models.ToDoItem;
const successStatusCode = 200;
const notFoundStatusCode = 404;

router.get("/getList/:userId", function (req, res) {
  const userId = req.params.userId;
  ToDoItem.find({ userId: userId }).then(function (doc) {
    res.json(doc);
  });
});

router.post("/insert", function (req, res) {
  const item = {
    text: req.body.text,
    complete: false,
    userId: req.body.userId,
  };

  const data = new ToDoItem(item);
  data.save();
  res.send(data._id);
});

router.post("/update", function (req, res) {
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

router.post("/delete", function (req, res) {
  const id = req.body.id;
  ToDoItem.findByIdAndRemove(id).exec();
  res.sendStatus(successStatusCode);
});

router.post("/complete", function (req, res) {
  const id = req.body.id;

  ToDoItem.findById(id, function (err, doc) {
    if (!err && doc) {
      doc.complete = true;
      doc.save();
      res.sendStatus(successStatusCode);
    } else {
      res.sendStatus(notFoundStatusCode);
    }
  });
});

module.exports = router;
