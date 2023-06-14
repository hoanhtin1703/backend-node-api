const express = require("express");
const app = express();
const port = process.env.PORT;
var bodyParser = require("body-parser");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
var path = require("path");
var cors = require("cors");

// To access public folder
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set up Global configuration access
dotenv.config();

// MULTER
const multer = require("multer");

const {
  hello,
  register,
  login,
  updateUser,
  deleteUser,
  userById,
  resetPassword,
} = require("./controllers/auth/auth");
const {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getProductsByCategoryID,
} = require("./controllers/products/products");
const {
  checkout,
  addToCart,
  cart,
  removeFromCart,
} = require("./controllers/user/cart");
const { isAdmin, checkAuth } = require("./controllers/middlewares/auth");
const {
  uploadFile,
  uploadFileProduct,
} = require("./controllers/middlewares/file-upload");
const { dashboardData, getAllUsers } = require("./controllers/admin/dashboard");
const {
  getAllOrders,
  changeStatusOfOrder,
  getSingleOrders,
} = require("./controllers/admin/orders");
const { orders } = require("./controllers/user/orders");
const {
  addCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  getSinglecategories,
} = require("./controllers/categories/category");
const {
  addToWishlist,
  wishlist,
  removeFromWishlist,
} = require("./controllers/user/wishlist");

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.get("/hello", hello);

// AUTH
app.post("/register", register);
app.post("/login", login);

// User Routes
app.post("/update-user", updateUser);
app.get("/user", userById);
app.get("/delete-user", deleteUser);
app.post("/reset-password", resetPassword);

// Products
app.post("/product", [uploadFileProduct], addProduct);
app.get("/singleproduct/:id", getProducts);
app.get("/products", getAllProducts);
app.post("/update-product/:id", [uploadFileProduct], updateProduct);
app.get("/delete-product/:id", deleteProduct);
app.get("/getproductsbycategoryid/:id", getProductsByCategoryID);
// CATEGORIES
app.post("/category", [uploadFile], addCategory);
app.get("/categories", getCategories);
app.get("/singlecategories/:id", getSinglecategories);
app.post("/update-category/:id", [uploadFile], updateCategory);
app.get("/delete-category/:id", deleteCategory);

// ORDERS
app.get("/orders/:id", orders);

// CHECKOUT
app.post("/checkout", checkout);

// WISHLIST
app.post("/add-to-wishlist", [checkAuth], addToWishlist);
app.get("/wishlist", [checkAuth], wishlist);
app.get("/remove-from-wishlist", [checkAuth], removeFromWishlist);

// ADMIN
app.get("/dashboard", dashboardData);
app.get("/admin/orders", getAllOrders);
app.get("/admin/orders/:id", getSingleOrders);
app.get("/admin/order-status", changeStatusOfOrder);
app.get("/admin/users", getAllUsers);

app.listen(process.env.PORT || 8081, () => {
  console.log(`Example app listening on port ${process.env.PORT}!`);
});
