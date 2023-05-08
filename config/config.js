// const mogoose = require('mongoose')

// const { DB_CON_STRING } = process.env

// module.exports = () => {
//     // mogoose.connect("mongodb://localhost/ecommerce")
//     mogoose.connect("mongodb+srv://abidrazaa:Abcd1234@cluster0.lr2rk.mongodb.net/?retryWrites=true&w=majority")
//         .then(() => console.log('DB Connection Successfull'))
//         .catch(err => console.log(err.message))
// }
// 'use strict';
// const dotenv = require('dotenv')
// const asset = require('assert')
// dotenv.config();
// const {
//     PORT,
//     HOST,
//     HOST_URL,
//     API_KEY,
//     AUTH_DOMAIN,
//     PROJECT_ID,
//     STORAGE_BUCKET,
//     MESSAGING_SENDER_ID,
//     APP_ID
// } =process.env;
// asset(PORT,"PORT is requied")
// asset(HOST,"HOST is requied")
// module.exports= {
//     port:PORT,
//     host:HOST,
//     url :HOST_URL,
//     firebaseConfig :{
//         apiKey: API_KEY,
//         authDomain: AUTH_DOMAIN,
//         projectId: PROJECT_ID,
//         storageBucket: STORAGE_BUCKET,
//         messagingSenderId: MESSAGING_SENDER_ID,
//         appId: APP_ID
//     }
// }

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

// Initialize Firebase
"use strict";
const PORT = 3000;
const HOST = "localhost";
module.exports = {
  port: PORT,
  host: HOST,
  firebaseConfig: {
    apiKey: "AIzaSyCqwLM6O_R-8WfkZl9EMQQPAMGp-G3qRsc",
    authDomain: "api-nodejs-41e54.firebaseapp.com",
    projectId: "api-nodejs-41e54",
    storageBucket: "api-nodejs-41e54.appspot.com",
    messagingSenderId: "789106582694",
    appId: "1:789106582694:web:cdc309c9725fcecfb9c067",
    //     }}
  },
};
