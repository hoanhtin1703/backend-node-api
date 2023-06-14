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
module.exports.getAllOrders = async (req, res) => {
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
        new Date(doc.data().createdAt.seconds * 1000)
      );
      OrderArray.push(order);
    });
    if (OrderArray.length > 0) {
      return res.json({
        data: OrderArray.reverse(),
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
module.exports.getSingleOrders = async (req, res) => {
  try {
    const orders = await firestore
      .collection("Orders")
      .doc(req.params.id)
      .get();
    // .get();
    const OrderArray = [];
    const orderData = orders.data();
    const order = new orderModel(
      orderData.id,
      orderData.user_id,
      orderData.item,
      orderData.info,
      orderData.status,
      orderData.payment_type,
      new Date(orderData.createdAt.seconds * 1000)
    );
    const user = await firestore
      .collection("User")
      .doc(orderData.user_id)
      .get();
    const user_name = user.data().name;
    OrderArray.push(order);
    const itemArray = OrderArray.map((obj) => {
      // Transform each object's properties as needed
      return {
        item: obj.item, // Include existing properties
        createdAt: obj.createdAt,
        status: obj.status,
      };
    });
    const NewArray = OrderArray.map((obj) => {
      // Transform each object's properties as needed
      return {
        ...obj, // Include existing properties
        user_name: user_name,
      };
    });
    return res.json({
      data: NewArray,
      item: itemArray,
      success: true,
      status: 200,
      message: "Order by id",
    });
  } catch (error) {
    return res.send(error.message);
  }
};
module.exports.changeStatusOfOrder = async (req, res) => {
  try {
    const orders = await firestore.collection("Orders").doc(req.query.orderId);
    await orders.update({
      status: req.query.status,
    });
    var mess = "";
    if (req.query.status == 1) {
      // Xử lý số lượng của từng sản phẩm
      const dataorderbyId = await firestore
        .collection("Orders")
        .doc(req.query.orderId)
        .get();
      const OrderArray = [];
      const orderData = dataorderbyId.data();
      OrderArray.push(orderData.item);
      const mappedArray = orderData.item.map((item) => ({
        _id: item._id,
        quantity: item.quantity,
        sold: item.quantity,
      }));
      mappedArray.forEach(async ({ _id, quantity }) => {
        const product = await firestore.collection("Products").doc(_id);
        // Retrieve the current quantity from the document
        try {
          // Retrieve the current quantity from the document
          const productSnapshot = await product.get();
          if (productSnapshot.exists) {
            const currentQuantity = productSnapshot.data().quantity;
            const updatedQuantity = currentQuantity - quantity;
            const currentsold = productSnapshot.data().sold;
            const updatedsold = currentsold + quantity;
            // Update the document with the new values
            await product.update({
              quantity: updatedQuantity,
              sold: updatedsold,
            });
          } else {
            throw new Error(`Product with _id: ${_id} does not exist.`);
          }
        } catch (error) {
          console.error(
            `Error updating quantity for product with _id: ${_id}`,
            error
          );
        }
      });
      mess = "Delivered";
    } else {
      mess = "Pending";
    }
    return res.json({
      success: true,
      status: 200,
      message: mess,
    });
  } catch (error) {
    return res.send(error.message);
  }
};
