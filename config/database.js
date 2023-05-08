const firebase = require("firebase");
const config = require("./config");
const database = firebase.initializeApp(config.firebaseConfig);
module.exports = database;
