const orderModel = require("../../models/order");
const userModel = require("../../models/user");
const productModel = require("../../models/product");
const { ObjectId } = require("mongodb");
const express = require("express");
var app = express();
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
module.exports.checkout = async (req, res) => {
  // tiep tục từ đây làm chức năng thanh toán
  try {
    // var body = req.body;
    const user = req.body.user;
    let idCurrent; //Id hiện tại
    const getSizeCategory = await firestore
      .collection("Orders")
      .get()
      .then((snap) => {
        idCurrent = snap.size;
      });
    // ?? Lấy kích thước của document
    const newindex = (idCurrent + 1).toString(); //* Đổi kiểu int sang string
    // ?? Thực Hiện Thêm Danh Mục
    const order = await firestore.collection("Orders").doc(newindex);
    await order.set({
      id: idCurrent + 1,
      user_id: user[0].id,
      item: req.body.item,
      info: req.body.info,
      status: 0,
      payment_type: "Cash On Delivery",
      createdAt: new Date(),
    });
    return res.json({
      status: 200,
      success: true,
      message: "successful checkout",
    });
  } catch (error) {
    return res.send(error.message);
  }
};

module.exports.addToCart = async (req, res) => {
  try {
    const data = req.body;
    let user = req.user;

    const addToCart = await userModel.findOneAndUpdate(
      { _id: user?._id },
      { $push: { cart: data } },
      { new: true }
    );

    return res.json({
      success: true,
      message: "product pushed in cart successfully",
      data: addToCart,
    });
  } catch (error) {
    return res.send(error.message);
  }
};

module.exports.removeFromCart = async (req, res) => {
  try {
    const id = req.query;
    let user = req.user;

    const removeFromCart = await userModel.findOneAndUpdate(
      { _id: user?._id },
      { $pull: { cart: { productId: ObjectId(id) } } },
      { new: true }
    );

    return res.json({
      success: true,
      message: "product removed from cart successfully",
      data: removeFromCart,
    });
  } catch (error) {
    return res.send(error.message);
  }
};

module.exports.cart = async (req, res) => {
  try {
    const user = req.user;

    const cart = await userModel
      .find({ _id: user._id })
      .populate("cart.productId")
      .select("-password -userType");

    return res.json({
      success: true,
      message: "cart",
      data: cart,
    });
  } catch (error) {
    return res.send(error.message);
  }
};
