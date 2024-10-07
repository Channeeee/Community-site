"use strict";

const db = require("../config/db");

class PostStorage {
    // 모든 게시글을 가져오는 메소드
    static async getPosts() {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM posts";
            db.query(query, (err, data) => {
                if (err) reject(`${err}`);
                resolve(data); // 가져온 게시글 데이터를 반환
            });
        });
    }

    // 특정 ID의 게시글을 가져오는 메소드
    static async getPostById(id) {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM posts WHERE postnum = ?";
            db.query(query, [id], (err, data) => {
                if (err) {
                    console.error("Database error:", err);
                    return reject(`${err}`);
                }
                if (data.length === 0) {
                    console.log("No post found with postnum:", id);
                    return resolve(null);  // 게시글이 없을 때 처리
                }
                resolve(data[0]); // 첫 번째 게시글 반환
            });
        });
    }
    
    

    // 새로운 게시글을 저장하는 메소드
    static async savePost(post) {
        return new Promise((resolve, reject) => {
            const query = "INSERT INTO posts (title, content, id) VALUES (?, ?, ?)";
            db.query(query, [post.title, post.content, post.id], (err, data) => {
                if (err) reject(`${err}`);
                resolve({ success: true }); // 성공적으로 저장되면 성공 응답 반환
            });
        });
    }

    // 특정 ID의 게시글을 삭제하는 메소드
    static async deletePost(postnum) {
        return new Promise((resolve, reject) => {
            const query = "DELETE FROM posts WHERE postnum = ?";
            db.query(query, [postnum], (err, data) => {
                if (err) reject(`${err}`);
                resolve({ success: true }); // 성공적으로 삭제되면 성공 응답 반환
            });
        });
    }
}

module.exports = PostStorage;