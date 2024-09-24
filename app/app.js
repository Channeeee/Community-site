"use strict";

//모듈
const express = require("express");
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const dotenv = require("dotenv");
const morgan = require("morgan");
const fs = require('fs');


dotenv.config()

//라우팅
const home = require("./src/routes/home");
const accessLogStream = fs.createWriteStream(
    path.join(__dirname,`/log/access.log`),
    {false: "a"}
);

const logger = require("./src/config/logger");
logger.info()

//앱 세팅
app.set("views", "./src/views");
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'src', 'public')));
app.use(express.static(path.join(__dirname, 'src', 'views')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(morgan(":method", {stream: accessLogStream}));
app.use("/", home);

module.exports = app;