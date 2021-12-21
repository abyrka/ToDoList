const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const { Readable } = require("stream");
const { StatusCodes } = require("http-status-codes");

const collections = require("../constants/collections");

const File = require("../models/file");

const Types = mongoose.Types;
const router = express.Router();

/**
 * GET /file/:fileId
 */
router.get("/:fileId", (req, res) => {
  let fileId;
  try {
    fileId = new Types.ObjectId(req.params.fileId);
  } catch (err) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message:
        "Invalid fileId in URL parameter. Must be a single String of 12 bytes or a string of 24 hex characters",
    });
  }

  File.findOne({ _id: fileId }).then(function (doc) {
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
 * POST /file/upload
 */
router.post("/upload", function (req, res) {
  const storage = multer.memoryStorage();
  const upload = multer({
    storage: storage,
    limits: { fields: 1, fileSize: 6000000, files: 1, parts: 2 },
  });
  upload.single("file")(req, res, (err) => {
    if (err) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Upload Request Validation Failed" });
    } else if (!req.body.itemId) {
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
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Error uploading file" });
    });

    uploadStream.on("finish", () => {
      const item = {
        name: fileName,
        fileId: id,
        itemId: req.body.itemId,
      };

      const data = new File(item);
      data.save();
      res.send(data._id);
    });
  });
});

router.get("/:id", function (req, res) {
  const id = req.params.id;
  File.find({ _id: id }).then(function (doc) {
    res.json(doc);
  });
});

module.exports = router;
