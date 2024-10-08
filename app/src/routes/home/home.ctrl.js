"use strict";

const User = require("../../models/User");
const PostStorage = require("../../models/PostStorage");
const MessageStorage = require("../../models/MessageStorage"); // MessageStorage를 불러옵니다.
const { formatTime } = require("../../public/js/home/time");
const path = require("path");
const fs = require("fs");
const { createObjectCsvWriter } = require("csv-writer");
const MessageExtractor = require("../../models/extractMessages"); // MessageExtractor를 불러옵니다.

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

  message: async (req, res) => {
    try {
      const userid = req.cookies.userid; // 쿠키에서 userid 값을 가져옴
      if (!userid) {
        return res.status(401).send("로그인이 필요합니다."); // 로그인되지 않은 경우 처리
      }

      const messages = await MessageStorage.getMessagesForUser(userid); // 해당 사용자의 쪽지 가져오기
      res.render("home/message", { messages }); // 가져온 쪽지 데이터를 EJS에 전달
    } catch (err) {
      console.error("쪽지 리스트 불러오기 오류:", err);
      res.status(500).send("서버 오류 발생");
    }
  },

  postView: (req, res) => {
    const postId = req.query.id; // URL에서 postnum을 가져옴
    console.log("postId:", postId); // postId 값 출력 확인

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

  messageChat: async (req, res) => {
    const roomid = req.query.roomid;
    const sender = req.cookies.userid;

    if (!roomid || !sender) {
      return res.status(400).send("잘못된 요청입니다.");
    }

    try {
      let messages = await MessageStorage.getMessagesByRoomId(roomid);

      if (messages.length === 0) {
        await MessageStorage.createMessage(
          roomid,
          1,
          sender,
          "상대방_아이디",
          "첫 번째 메시지"
        );
        messages = await MessageStorage.getMessagesByRoomId(roomid);
      }

      const exportsDir = path.join(__dirname, "../../exports");
      if (!fs.existsSync(exportsDir)) {
        fs.mkdirSync(exportsDir, { recursive: true });
      }

      const csvFilePath = path.join(exportsDir, `messages_room_${roomid}.csv`);

      // CSV 데이터 작성 (BOM 추가)
      const csvHeaders = "보낸 사람,내용,보낸 시간\n";
      const csvData = messages
        .map((msg) => `${msg.sender},${msg.content},${msg.send_time}`)
        .join("\n");

      // UTF-8 BOM을 추가한 상태로 파일 저장
      fs.writeFileSync(csvFilePath, "\uFEFF" + csvHeaders + csvData, "utf8");

      // CSV 파일 다운로드 링크 제공
      res.render("home/message_chat", {
        messages,
        roomid,
        sender,
        csvDownloadLink: `/exports/messages_room_${roomid}.csv`,
      });
    } catch (err) {
      console.error("메시지 조회/생성 오류:", err);
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

      await PostStorage.savePost(post); // 게시글을 DB에 저장
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

  sendMessage: async (req, res) => {
    const { roomid, content } = req.body;
    const sender = req.cookies.userid; // 로그인한 사용자 ID 가져오기

    // 필수 값 체크
    if (!content || !roomid || !sender) {
      return res.status(400).send("메시지 내용 또는 방 ID가 누락되었습니다.");
    }

    try {
      const postnum = 1; // 현재 포스트 번호를 실제로 설정해야 합니다.

      // reciper를 message_list에서 찾기
      const reciper = await MessageStorage.getReciperByRoomId(roomid, sender);

      // DB에 메시지 저장
      await MessageStorage.createMessage(roomid, postnum, sender, content);

      // 저장 후 해당 채팅방으로 리다이렉트
      res.redirect(`/message_chat?roomid=${roomid}`); // URL 수정: /message_chat -> /message/chat
    } catch (err) {
      console.error("메시지 저장 오류:", err);
      res.status(500).send("서버 오류 발생");
    }
  },

  extractMessages: async (req, res) => {
    const messageExtractor = new MessageExtractor(req.body); // POST 요청으로 들어온 데이터 처리
    const result = await messageExtractor.extract();
    if (result.success) {
      return res.download(result.filePath); // 성공 시 CSV 파일 다운로드
    } else {
      return res.status(400).send(result.msg); // 실패 시 오류 메시지 반환
    }
  },
};

module.exports = {
  output,
  process,
};
