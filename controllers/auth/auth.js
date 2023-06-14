const userModel = require("../../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const database = require("../../config/database");
const cors = require("cors");
const firestore = database.firestore();

module.exports.hello = async (req, res) => {
  try {
    const user = await firestore.collection("User").get();
    // Create a query against the collection.
    const categoryList = [];
    user.forEach((doc) => {
      const categoryModel = new userModel(
        doc.id,
        doc.data().name,
        doc.data().email,
        doc.data().password,
        doc.data().userType
      );
      categoryList.push(categoryModel);
    });
    return res.json({
      success: true,
      status: 400,
      message: "user Logged in",
      data: categoryList,
    });
  } catch (error) {}
};
module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await firestore
      .collection("User")
      .where("email", "==", req.body.email)
      .where("password", "==", req.body.password)
      .get();
    if (user.empty) {
      return res.json({
        success: false,
        status: 400,
        message: "user does not exist with this email and password",
      });
    } else {
      const userList = [];
      user.forEach((doc) => {
        const usermodel = new userModel(
          doc.id,
          doc.data().name,
          doc.data().email,
          doc.data().password,
          doc.data().userType
        );
        userList.push(usermodel);
      });
      return res.json({
        success: true,
        status: 200,
        message: "user Logged in",
        data: userList,
      });
    }
  } catch (error) {
    return res.send(error.message);
  }
};

module.exports.register = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const emailexist = await firestore
      .collection("User")
      .where("email", "==", req.body.email)
      .get();
    if (emailexist.empty) {
      const user = await firestore.collection("User").doc();
      await user.set({
        name: name,
        email: email,
        password: password,
        userType: "USER",
      });
      return res.json({
        success: true,
        status: 200,
        message: "Register successfully",
      });
    } else {
      return res.json({
        success: false,
        status: 400,
        message: "Email is already exists",
      });
    }
  } catch (error) {
    return res.send(error.message);
  }
};

module.exports.updateUser = async (req, res) => {
  try {
    const userDataToBeUpdated = req.body;
    const { id } = req.query;
    const user = await userModel.findOne({ _id: id });

    if (!user) return res.send("user does not exist");

    let updatedUser = await userModel.findOneAndUpdate(
      { _id: id },
      userDataToBeUpdated,
      { new: true }
    );

    return res.json({
      success: true,
      message: "user updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    return res.send("error : ", error.message);
  }
};

module.exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.query;

    const user = await userModel.findOne({ _id: id });
    if (!user) return res.status(200).send("user does not exist");

    await userModel.findOneAndDelete({ _id: id });

    return res.json({
      success: true,
      message: "user deleted successfully",
    });
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

module.exports.userById = async (req, res) => {
  try {
    const { id } = req.query;

    const user = await userModel.findOne({ _id: id });
    if (!user) return res.send("user does not exist");

    return res.json({
      success: true,
      message: "user deleted successfully",
      data: user,
    });
  } catch (error) {
    return res.send("error : ", error.message);
  }
};

module.exports.resetPassword = async (req, res) => {
  try {
    const { password, newPassword } = req.body;
    const { id } = req.query;

    if (!password || !newPassword || !id) return res.send("Fields are empty");

    let user = await userModel.findOne({ _id: id });

    if (!user) return res.send("user does not exist");

    // comparing the password from the password in DB to allow changes
    if (bcrypt.compare(password, user?.password)) {
      // encrypting new password
      user.password = await bcrypt.hash(newPassword, 10);
      user.save();
      return res.json({
        success: true,
        message: "password updated successfully",
      });
    }

    return res.json({
      success: false,
      message: "wrong password",
    });
  } catch (error) {
    return res.send(error.message);
  }
};
