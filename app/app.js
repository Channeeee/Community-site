"use strict";
// 모듈
const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const morgan = require("morgan");
const fs = require("fs");
const cookieParser = require("cookie-parser");

dotenv.config();

// 라우팅
const home = require("./src/routes/home");
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, `/log/access.log`),
  { flags: "a" } // 플래그가 잘못 설정되어 있었음 ('false' → 'a')
);

const logger = require("./src/config/logger");
logger.info();

// 앱 세팅
app.set("views", path.join(__dirname, "src", "views")); // views 경로 명확히 설정
app.set("view engine", "ejs"); // EJS를 템플릿 엔진으로 사용
app.use(express.static(path.join(__dirname, "src", "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(morgan(":method", { stream: accessLogStream }, "dev"));
app.use("/", home);

// ------------------------ 쿠키 ----------------------- //

nunjucks.configure('./src/views', {
    express: app,
    watch: true,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  const { id } = req.cookies;
  if (id) {
    res.render("login", { id });
    return;
  }

  res.render("index");
});

app.post("/", (req, res) => {
  const { name } = req.body;
  res.cookie("id", name).redirect("/");
});

app.get("/delete", (req, res) => {
  res.clearCookie("id").redirect("/");
});

module.exports = app;
