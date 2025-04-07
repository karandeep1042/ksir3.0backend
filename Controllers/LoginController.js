const mysql = require('mysql2');
const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken');

const con = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "ksir",
    insecureAuth: true
});

const sendotp = (req, res) => {
    let { otp, otpEmail } = req.body;
    console.log(otpEmail);
    console.log(otp);

    var mailOptions = {
        from: 'ks1895304@gmail.com',
        to: otpEmail,
        subject: 'OTP',
        html: `Your OTP is ${otp}`,
    }

    const ans = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // Use `true` for port 465, `false` for all other ports
        auth: {
            user: 'ks1895304@gmail.com',
            pass: "rgwr yomd bpzq mkeh",
        },
    }).sendMail(mailOptions, (err, data) => {
        if (err) {
            console.log(err);
            res.json({ sent: false })
        }
        else {
            console.log("sent");
            res.json({ sent: true })
        }
    });

}

const getuserdetails = (req, res) => {
    let sql = `select * from user where user_password='${req.params.password}' AND user_email='${req.params.email}'`;

    con.query(sql, (err, data) => {
        if (err) {
            console.log(err);
        } else if (data.length != 0) {
            const accessToken = jwt.sign({ userId: data[0].user_id, username: data[0].user_name, isAdmin: data[0].adminpermission, uemail: data[0].user_email }, process.env.jwt_key)
            // console.log(data);
            res.cookie('token', accessToken, { httpOnly: true, sameSite: 'strict', maxAge: 3600000 });
            res.json({ msg: "valid", data, accessToken });
        } else {
            res.status(401).json({ msg: "invalid" });
        }
    })
}

const checkemail = (req, res) => {
    let sql = `select * from user where user_email='${req.params.email}'`
    con.query(sql, (err, data) => {
        if (err) {
            console.log(err);
        } else if (data.length != 0) {
            res.json({ valid: true });
        } else {
            res.status(401).json({ valid: false });
        }
    })
}

const updatenewpass = (req, res) => {
    let { pass, otpEmail } = req.body;
    console.log(pass);
    console.log(otpEmail);

    let sql = `update user set user_password='${pass}' where user_email='${otpEmail}'`
    con.query(sql, (err, data) => {
        if (err) {
            console.log(err);
            res.status(401).json({ valid: false });
        } else if (data.affectedRows > 0) {
            res.json({ valid: true });
        } else {
            res.status(401).json({ valid: false });
        }
    })
}

const logout = (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        // secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
    });

    res.json({ valid: true, message: 'Logged out successfully' });
}

module.exports = { getuserdetails, checkemail, sendotp, updatenewpass, logout }