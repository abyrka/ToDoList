const express = require("express");
const { StatusCodes } = require("http-status-codes");

const Attachment = require("../models/attachment");
const ToDoItem = require("../models/toDoItem");

const {
  getItemAttachmentsKey,
  getUserToDoItemsKey,
} = require("../utils/cacheKeyGenerator");
const { clearCache } = require("../utils/cache");

const router = express.Router();

/**
 * GET /to-do-list/:itemId/attachments
 */
router.get("/:itemId/attachments", function (req, res) {
  const itemId = req.params.itemId;
  Attachment.find({ itemId: itemId })
    .cache({ key: getItemAttachmentsKey(itemId) })
    .then(function (doc) {
      res.json(doc);
    });
});

/**
 * POST /to-do-list/create
 */
router.post("/create", function (req, res) {
  const item = {
    text: req.body.text,
    complete: false,
    userId: req.body.userId,
  };

  const data = new ToDoItem(item);
  data.save();
  clearCache(getUserToDoItemsKey(req.body.userId));
  res.send(data._id);
});

/**
 * PUT /to-do-list/update
 */
router.put("/update", function (req, res) {
  const id = req.body.id;

  ToDoItem.findById(id, function (err, doc) {
    if (!err && doc) {
      doc.text = req.body.text;
      doc.save();
      clearCache(getUserToDoItemsKey(req.body.userId));
      res.sendStatus(StatusCodes.OK);
    } else {
      res.sendStatus(StatusCodes.NOT_FOUND);
    }
  });
});

/**
 * POST /to-do-list/delete
 */
router.delete("/delete", function (req, res) {
  const id = req.body.id;
  ToDoItem.findByIdAndRemove(id).exec();
  clearCache(getUserToDoItemsKey(req.body.userId));
  res.sendStatus(StatusCodes.OK);
});

/**
 * PUT /to-do-list/complete
 */
router.put("/complete", function (req, res) {
  const id = req.body.id;

  ToDoItem.findById(id, function (err, doc) {
    if (!err && doc) {
      doc.complete = req.body.complete;
      doc.save();
      clearCache(getUserToDoItemsKey(req.body.userId));
      res.sendStatus(StatusCodes.OK);
    } else {
      res.sendStatus(StatusCodes.NOT_FOUND);
    }
  });
});

module.exports = router;
