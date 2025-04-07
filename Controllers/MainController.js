const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const con = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    insecureAuth: true
});

//Authorization starts
function verifyToken(req, res, next) {
    const token = req.cookies.token;
    console.log(token);
    if (token) {
        jwt.verify(token, process.env.jwt_key, (err, data) => {
            if (err) {
                console.log("Invalid Token");
                res.json({ valid: false, msg: "invalidtoken" });
            } else {
                console.log("Valid Token");
                req.user = data;
                next();
            }
        })
    } else {
        console.log("No Token");
        res.json({ valid: false, msg: "notoken" });
    }
}
//Authorization ends

const fetchuserdetails = (req, res) => {
    let sql = `select * from user where user_id=${req.user.userId}`;
 
    con.query(sql, (err, data) => {
        if (err) {
            console.log(err);
        } else if (data.length != 0) {
            console.log(data);
            res.json(data);
        }
    })
}

const checkusertoken = (req, res) => {
    console.log(req.cookies.token);
    
    if (req.cookies.token) {
        res.json({ valid: true, msg: "loggedin" });
    } else {
        res.json({ valid: false, msg: "notloggedin" });
    }
}

module.exports = { verifyToken, fetchuserdetails, checkusertoken }