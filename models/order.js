// const mongoose = require("mongoose");
// const jwt = require("jsonwebtoken");

// // const { TOKEN_KEY } = process.env

// const userSchema = mongoose.Schema(
//   {
//     name: String,
//     email: { type: String, required: true, unique: true },
//     userType: String,
//     password: String,
//     token: String,
//     wishlist: [
//       {
//         productId: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
//         quantity: Number,
//       },
//     ],
//   },
//   { timestamps: true }
// );

// // userSchema.methods.generateAuthToken = function () {
// //     this.token = jwt.sign({ userID: this._id, email: this.email }, TOKEN_KEY, { expiresIn: '10h' })
// // }

// module.exports = mongoose.model("user", userSchema);
//
const admin = require("firebase-admin");
const bcrypt = require("bcryptjs");
class OrderModel {
  constructor(orderId, user, item, info, status, payment_type, createdAt) {
    this.orderId = orderId;
    this.user = user;
    this.item = item;
    this.info = info;
    this.status = status;
    this.payment_type = payment_type;
    this.createdAt = createdAt;
  }
}
module.exports = OrderModel;
