const mysql = require('mysql');
var connectionParam = {
    host: "localhost",
    user: "root",
    port: 3307,
    password: "",
    database: "mern_project"


} 
const conn = mysql.createConnection(connectionParam);
conn.connect((err)=>{
    if(err) throw err;
    console.log("connected successfully!");
});

module.exports.conn = conn;
