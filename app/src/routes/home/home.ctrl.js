"use strict";

const User = require("../../models/User");
const PostStorage = require("../../models/PostStorage");

const output = {
  home: (req, res) => {
    res.render("home/index");
  },

  board: (req, res) => {
    res.render("home/board");
  },

  login: (req, res) => {
    res.render("home/login");
  },

  register: (req, res) => {
    res.render("home/register");
  },

  message: (req, res) => {
    res.render("home/message");
  },

  postView: (req, res) => {
    const postId = req.query.id;  // URL에서 postnum을 가져옴
    console.log("postId:", postId);  // postId 값 출력 확인

    if (!postId) {
      return res.status(400).send("잘못된 요청입니다.");
    }

    PostStorage.getPostById(postId)
      .then((post) => {
        if (!post) {
          return res.status(404).send("해당 게시글을 찾을 수 없습니다.");
        }
        res.render("home/post_view", { post, postId });
      })
      .catch((err) => {
        console.error("Error fetching post:", err);
        res.status(500).send("서버 오류 발생");
      });
  },

  community: async (req, res) => {
    try {
      const posts = await PostStorage.getPosts(); // 모든 게시글을 DB에서 가져옴
      res.render("home/community", { posts }); // 가져온 게시글 목록을 community.ejs에 전달
    } catch (err) {
      console.error(err);
      res.status(500).send("서버 오류 발생");
    }
  },
};

const process = {
  login: async (req, res) => {
    const user = new User(req.body); // 로그인 요청 데이터를 기반으로 User 객체 생성
    const response = await user.login(); // 로그인 처리

    const url = {
      method: "POST",
      path: "/login",
      status: response.err ? 400 : 200,
    };

    return res.json(response); // 로그인 결과를 클라이언트에 반환
  },

  register: async (req, res) => {
    const user = new User(req.body); // 회원가입 요청 데이터를 기반으로 User 객체 생성
    const response = await user.register(); // 회원가입 처리

    const url = {
      method: "POST",
      path: "/register",
      status: response.err ? 409 : 201,
    };
    return res.json(response); // 회원가입 결과를 클라이언트에 반환
  },

  writePost: async (req, res) => {
    try {
      const { title, content } = req.body; // 클라이언트에서 전송된 게시글 제목과 내용
      const id = "사용자 이름"; 
      const post = { title, content, id }; // 게시글 데이터 구성

      await PostStorage.savePost(post); // 게시글을 DB에 저장P
      res.json({ success: true }); // 게시글 작성 후 게시글 목록으로 리다이렉트
    } catch (err) {
      console.error("게시글 작성 오류:", err);
      res.status(500).send("게시글 작성 실패"); // 오류 발생 시 에러 메시지 출력
    }
  },

  deletePost: async (req, res) => {
    try {
        const postId = req.params.postnum; // URL에서 삭제할 게시글의 postnum을 가져옴
        console.log("Deleting post with postnum:", postId); // 로그 추가
        await PostStorage.deletePost(postId); // 해당 postnum의 게시글을 삭제
        res.json({ success: true }); // 삭제 성공 시 JSON 형식으로 응답
    } catch (err) {
        console.error("게시글 삭제 오류:", err);
        res.status(500).json({ success: false, message: "게시글 삭제 실패" }); // 삭제 실패 시 오류 메시지 반환
    }
},
};

module.exports = {
  output,
  process,
};
