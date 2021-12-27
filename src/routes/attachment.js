const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const { Readable } = require("stream");
const { StatusCodes } = require("http-status-codes");

const collections = require("../constants/collections");

const Attachment = require("../models/attachment");

const Types = mongoose.Types;
const router = express.Router();

/**
 * GET /attachment/:attachmentId
 */
router.get("/:id", (req, res) => {
  let attachmentId;
  try {
    attachmentId = new Types.ObjectId(req.params.attachmentId);
  } catch (err) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message:
        "Invalid attachmentId in URL parameter. Must be a single String of 12 bytes or a string of 24 hex characters",
    });
  }

  Attachment.findOne({ _id: attachmentId }).then(function (doc) {
    if (!doc) {
      return res.sendStatus(StatusCodes.NOT_FOUND);
    }

    res.set("content-type", "application/octet-stream");
    res.set("accept-ranges", "bytes");

    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: collections.FileStorage,
    });

    const downloadStream = bucket.openDownloadStream(doc.fileId);

    downloadStream.on("data", (chunk) => {
      res.write(chunk);
    });

    downloadStream.on("error", () => {
      res.sendStatus(StatusCodes.NOT_FOUND);
    });

    downloadStream.on("end", () => {
      res.end();
    });
  });
});

/**
 * POST /to-do-list/delete
 */
router.delete("/delete", function (req, res) {
  const id = req.body.id;

  //clearCache(getUserToDoItemsKey(req.body.userId));
  Attachment.findById(id, function (err, doc) {
    if (!err && doc) {
      deleteFile(doc.fileId);
      Attachment.remove(id).exec();
      res.sendStatus(StatusCodes.OK);
    } else {
      res.sendStatus(StatusCodes.NOT_FOUND);
    }
  });
});

/**
 * POST /attachment/upload
 */
router.post("/upload", function (req, res) {
  const storage = multer.memoryStorage();
  const upload = multer({
    storage: storage,
    limits: { fields: 1, fileSize: 6000000, files: 1, parts: 2 },
  });
  upload.single("file")(req, res, (err) => {
    if (err) {
      console.warn("Upload request validation failed");
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Upload request validation failed" });
    } else if (!req.body.itemId) {
      console.warn("No to do item id in request body");
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "No to do item id in request body" });
    }

    const fileName = req.file.originalname;

    const readableFileStream = new Readable();
    readableFileStream.push(req.file.buffer);
    readableFileStream.push(null);

    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: collections.FileStorage,
    });

    const uploadStream = bucket.openUploadStream(fileName);
    const id = uploadStream.id;
    readableFileStream.pipe(uploadStream);

    uploadStream.on("error", () => {
      console.error("Error uploading file");
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Error uploading file" });
    });

    uploadStream.on("finish", () => {
      console.log("Success uploading file");
      const data = new Attachment({
        name: fileName,
        fileId: id,
        itemId: req.body.itemId,
      });
      data.save();
      res.send(data._id);
    });
  });
});

async function deleteFile(id) {
  const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: collections.FileStorage,
  });
  const documents = await bucket.find(id).toArray();
  if (documents && documents.length === 0) {
    return;
  }
  return Promise.all(
    documents.map((doc) => {
      return bucket.delete(doc._id);
    })
  );
}

module.exports = router;
