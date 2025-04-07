const mysql = require('mysql2');
const jwt = require('jsonwebtoken');

const con = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "ksir",
    insecureAuth: true
});

//Authorization starts
function verifyToken(req, res, next) {
    const token = req.cookies.token;

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