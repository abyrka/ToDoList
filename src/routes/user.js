const express = require("express");

const ToDoItem = require("../models/toDoItem");
const User = require("../models/user");

const {
  userListKey,
  getUserToDoItemsKey,
} = require("../utils/cacheKeyGenerator");

const router = express.Router();

/**
 * GET /user/list
 */
router.get("/list", function (req, res) {
  User.find()
    .cache({ key: userListKey })
    .then(function (doc) {
      res.json(doc);
    });
});

/**
 * GET /user/:userId/items
 */
router.get("/:userId/items", function (req, res) {
  const userId = req.params.userId;
  ToDoItem.find({ userId: userId })
    .cache({ key: getUserToDoItemsKey(userId) })
    .then(function (doc) {
      res.json(doc);
    });
});

module.exports = router;
