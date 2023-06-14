const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const bodyParser = require("body-parser");
var app = express();
const util = require("util");
const multer = require("multer");

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Header", "Content-Type");
  next();
});

// const path_url_static = "http://localhost:8080/images/";
const url_image = path.join(
  path.dirname(require.main.filename),
  "../backend-node-master/public/uploads/category"
);
// for parsing application/json
// app.use(express.json());
// // for parsing application/x-www-form-urlencoded
// app.use(express.urlencoded({ extended: true }));
// // for parsing multipart/form-data
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// ** Tạo bộ nhớ
let category_storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../backend-node-master/public/uploads/category");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
let product_storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../backend-node-master/public/uploads/product");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const imageFilter = function (req, file, cb) {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
    req.fileValidationError = "Only image files are allowed!";
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};
const upload_category = multer({
  storage: category_storage,
  fileFilter: imageFilter,
});
const upload_product = multer({
  storage: product_storage,
  fileFilter: imageFilter,
});
// ** Bộ lọc file ảnh
// TODO Xây dựng hàm up ảnh
module.exports.uploadFile = async function (req, res, next) {
  try {
    console.log("DSf");
    upload_category.single("file")(req, res, (err) => {
      return next();
    });
  } catch {
    return res
      .status(500)
      .json({ err: "something went wrong", msg: error.message });
  }
};
//
module.exports.uploadFileProduct = async function (req, res, next) {
  try {
    console.log("DSf");
    upload_product.single("file")(req, res, (err) => {
      return next();
    });
  } catch {
    return res
      .status(500)
      .json({ err: "something went wrong", msg: error.message });
  }
};
