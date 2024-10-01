"use strict";

const express = require("express");
const router = express.Router();

const ctrl = require("./home.ctrl");

router.get("/", ctrl.output.home);
router.get("/board", ctrl.output.board);
router.get("/login", ctrl.output.login);
router.get("/register", ctrl.output.register);
router.get("/post_view", ctrl.output.postView);
router.get("/community", ctrl.output.community);
router.get("/message", ctrl.output.message);

// POST 요청 처리 추가
router.post("/board/write", ctrl.process.writePost); // board/write 경로 추가

router.post("/login", ctrl.process.login);
router.post("/register", ctrl.process.register);

// 게시글 삭제 처리
router.delete("/delete-post/:id", ctrl.process.deletePost);

module.exports = router;
