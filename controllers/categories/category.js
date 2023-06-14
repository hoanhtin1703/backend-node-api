// const categoryModel = require("../../models/category")
const express = require("express");
var app = express();
const util = require("util");
const multer = require("multer");
const CategoryModel = require("../../models/category");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const database = require("../../config/database");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const firestore = database.firestore();
app.use(express.json());
// for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// for parsing multipart/form-data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// TODO ADD category
module.exports.addCategory = async (req, res) => {
  try {
    let idCurrent; //Id hiện tại
    const getSizeCategory = await firestore
      .collection("Category")
      .get()
      .then((snap) => {
        idCurrent = snap.size;
      });
    // ?? Lấy kích thước của document
    const newindex = (idCurrent + 1).toString(); //* Đổi kiểu int sang string
    // ?? Thực Hiện Thêm Danh Mục
    const category = await firestore.collection("Category").doc(newindex);
    await category.set({
      id: idCurrent + 1,
      name: req.body.name,
      image_url: req.file["filename"],
    });
    const msg = {
      success: true,
      status: 200,
      message: "Thêm thành công",
    };
    res.status(200).send(msg);
  } catch (error) {
    res.status(400).send(error.message);
  }
};
// TODO Update category
module.exports.updateCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const category = await firestore.collection("Category").doc(id);
    // ??
    if (!req.file) {
      await category.update({
        name: req.body.name,
      });
    }
    // ??
    else {
      await category.update({
        name: req.body.name,
        image_url: req.file["filename"],
      });
    }
    res.status(200).send({
      success: true,
      message: "Cập Nhật Thành Công",
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
};
// TODO Delete category
module.exports.deleteCategory = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    const DeleteCategory = await firestore.collection("Category").doc(id);
    await DeleteCategory.delete();
    res.status(200).send({
      success: true,
      status: 0,
      message: "Xóa thành công",
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports.getCategories = async (req, res) => {
  try {
    const category = await firestore.collection("Category").get();
    // const categoriesCount = await categoryModel.find().count();

    // Create a query against the collection.
    const cateList = [];
    category.forEach((doc) => {
      const categoryModel = new CategoryModel(
        doc.id,
        doc.data().name,
        doc.data().image_url
      );
      cateList.push(categoryModel);
    });
    return res.json({
      success: true,
      status: 200,
      message: "list of all categories",
      category: cateList,
    });
  } catch (error) {
    return res.send(error.message);
  }
};
module.exports.getSinglecategories = async (req, res) => {
  try {
    const category = await firestore.collection("Category").doc(req.params.id);
    const list = await category.get();
    if (list.empty) {
      res.status(400).send(error.message);
    } else {
      return res.json({
        success: true,
        status: 200,
        message: "list of all categories",
        category: list.data(), // convert to JSON object
      });
    }
  } catch (error) {
    return res.send(error.message);
  }
};
