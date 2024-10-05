const db = require("../config/db");

class MessageStorage {
  static async getMessages() {
    const query = "SELECT * FROM message_list";
    try {
      const [messages] = await db.promise().query(query); // .promise()로 쿼리를 Promise 기반으로 실행
      return messages;
    } catch (err) {
      console.error("DB에서 쪽지 가져오기 오류:", err);
      throw err;
    }
  }
}

module.exports = MessageStorage;
