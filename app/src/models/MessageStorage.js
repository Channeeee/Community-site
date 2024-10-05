const db = require("../config/db");

class MessageStorage {
  static async getMessagesForUser(userid) {
    const query = `
      SELECT 
        m.roomid, 
        m.reciper, 
        m.sender, 
        p.title AS message_title, 
        m.created_at 
      FROM 
        message_list m
      JOIN 
        posts p 
      ON 
        m.postnum = p.postnum
      WHERE 
        m.sender = ? OR m.reciper = ?;
    `;
    try {
      const [messages] = await db.promise().query(query, [userid, userid]); // userid를 바인딩
      return messages; // 결과 반환
    } catch (err) {
      console.error("DB에서 쪽지 가져오기 오류:", err);
      throw err;
    }
  }
}

module.exports = MessageStorage;
