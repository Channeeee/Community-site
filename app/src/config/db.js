const mysql = require("mysql");

const db = mysql.createConnection({
    host: process.env.db_host,
    user: process.env.db_user,
    password: process.env.db_psword,
    database: process.env.db_database,
});

db.connect();

module.exports = db;