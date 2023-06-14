const express = require("express");
var app = express();
const ProductsModel = require("../../models/product");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const database = require("../../config/database");
const firestore = database.firestore();
app.use(express.json());
// for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// for parsing multipart/form-data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
module.exports.addProduct = async (req, res) => {
  try {
    // console.log(req.body.name);
    let idCurrent; //Id hiện tại
    const getSizeCategory = await firestore
      .collection("Products")
      .get()
      .then((snap) => {
        idCurrent = snap.size;
      });
    // ?? Lấy kích thước của document
    const newindex = (idCurrent + 1).toString(); //* Đổi kiểu int sang string
    // ?? Thực Hiện Thêm Danh Mục
    const product = await firestore.collection("Products").doc(newindex);
    await product.set({
      id: idCurrent + 1,
      name: req.body.name,
      quantity: req.body.quantity,
      price: req.body.price,
      description: req.body.description,
      category_id: req.body.category_id,
      image_url: req.file["filename"],
      sold: 0,
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

module.exports.getProducts = async (req, res) => {
  try {
    const products = await firestore.collection("Products").doc(req.params.id);
    const list = await products.get();
    if (list.empty) {
      res.status(400).send(error.message);
    } else {
      return res.json({
        success: true,
        status: 200,
        message: "Product is available ",
        product: list.data(), // convert to JSON object
      });
    }
  } catch (error) {
    return res.send(error.message);
  }
};

module.exports.updateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await firestore.collection("Products").doc(id);
    //  ?
    if (!req.file) {
      await product.update({
        name: req.body.name,
        quantity: req.body.quantity,
        price: req.body.price,
        description: req.body.description,
        category_id: req.body.category_id,
      });
    }
    // ??
    else {
      await product.update({
        name: req.body.name,
        quantity: req.body.quantity,
        price: req.body.price,
        description: req.body.description,
        category_id: req.body.category_id,
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

module.exports.deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    const DeleteProduct = await firestore.collection("Products").doc(id);
    await DeleteProduct.delete();
    res.status(200).send({
      success: true,
      status: 0,
      message: "Xóa thành công",
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports.getAllProducts = async (req, res) => {
  try {
    const Product = await firestore.collection("Products").get();
    // const categoriesCount = await ProductModel.find().count();

    // Create a query against the collection.
    const productList = [];
    Product.forEach((doc) => {
      const product = new ProductsModel(
        doc.id,
        doc.data().name,
        doc.data().image_url,
        doc.data().quantity,
        doc.data().price,
        doc.data().category_id,
        doc.data().description
      );
      productList.push(product);
    });
    return res.json({
      success: true,
      status: 200,
      message: "list of all Products",
      product: productList,
    });
  } catch (error) {
    return res.send(error.message);
  }
};
module.exports.getProductsByCategoryID = async (req, res, next) => {
  try {
    const products = await firestore.collection("Products").get();
    const productsArray = [];
    products.forEach((doc) => {
      const data = doc.data();
      const categoryIdObject = JSON.parse(data.category_id);
      const categoryId = categoryIdObject.id;
      const product = new ProductsModel(
        doc.id,
        doc.data().name,
        doc.data().image_url,
        doc.data().quantity,
        doc.data().price,
        categoryId,
        doc.data().description
      );
      productsArray.push(product);
    });
    const category2Products = productsArray.filter(
      (product) => product.category_id === parseInt(req.params.id)
    );
    if (category2Products.length > 0) {
      return res.json({
        product: category2Products,
        success: true,
        status: 200,
        message: "list of all Products",
      });
    } else {
      return res.json({
        success: false,
        status: 400,
        message: "No list of all Products",
      });
    }
  } catch (error) {
    return res.send(error.message);
  }
};
