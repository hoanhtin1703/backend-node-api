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
module.exports.orders = async (req, res) => {
  try {
    const orders = await firestore.collection("Orders").get();
    const OrderArray = [];
    orders.forEach((doc) => {
      const data = doc.data();
      const order = new orderModel(
        doc.id,
        doc.data().user_id,
        doc.data().item,
        doc.data().info,
        doc.data().status,
        doc.data().payment_type,
        doc.data().createdAt
      );
      OrderArray.push(order);
    });
    console.log(OrderArray);
    const FilterOrderArray = OrderArray.filter(
      (order) => order.user === req.params.id
    );
    const newArray = FilterOrderArray.map((obj) => {
      // Transform each object's properties as needed
      return {
        item: obj.item, // Include existing properties
        createdAt: obj.createdAt,
        status: obj.status,
      };
    });
    console.log(newArray);
    if (FilterOrderArray.length > 0) {
      return res.json({
        data: FilterOrderArray,
        item: newArray,
        success: true,
        status: 200,
        message: "list of all Order",
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
