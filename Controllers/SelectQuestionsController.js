const mysql = require('mysql2');

const con = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "ksir",
    insecureAuth: true
});

const getprogramlist = (req, res) => {
    sql = `select * from program`
    console.log(req.user);
    con.query(sql, (err, data) => {
        if (err) {
            console.log(err);
            res.send({ valid: false });
        } else if (data.length != 0) {
            res.send({ valid: true, data });
        }
    })
}

const getsemanddiv = (req, res) => {
    sql = `select program_id,program_divisions,program_semesters from program where program_name='${req.params.coursename}'`;
    con.query(sql, (err, data) => {
        if (err) {
            console.log(err);
        } else if (data.length != 0) {
            res.send({ valid: true, data });
        }
    })
}

const getsubjects = (req, res) => {
    sql = `select subject_name from subjects where semester=${req.params.semester} AND program_id=${req.params.courseid}`;
    con.query(sql, (err, data) => {
        if (err) {
            console.log(err);
        } else if (data.length != 0) {
            res.send(data);
        }
    })
}

const getsubjectID = (req, res) => {
    let sql = `select subject_id from subjects where subject_name='${req.params.subjectName}'`;
    con.query(sql, (err, data) => {
        if (err) {
            console.log(err);
        } else if (data.length != 0) {
            // console.log(data);
            res.send(data);
        }
    })
}

const checkexistingpaper = (req, res) => {
    let sql = `select * from questions where program_id=${req.params.programid} AND subject_id=${req.params.subjectid} AND division='${req.params.division}'`
    con.query(sql, (err, data) => {
        if (err) {
            console.log(err);
        } else if (data.length != 0) {
            res.send({ msg: "exists", data: data });
        } else if (data.length == 0) {
            console.log("empty");
            res.send({ msg: "doesnotexists" });
        }
    })
}

const insertpaperdetails = (req, res) => {
    const { q1, q2, q3, q4, q5, q6, programID, subjectID, division, newrecord } = req.body;
    console.log(req.body);
    let sql;
    if (newrecord) {
        sql = `insert into questions values('${q1}','${q2}','${q3}','${q4}','${q5}','${q6}',${programID},${subjectID},'${division}')`
    } else {
        sql = `update questions set q1='${q1}',q2='${q2}',q3='${q3}',q4='${q4}',q5='${q5}',q6='${q6}' where program_id=${programID} AND subject_id=${subjectID} AND division='${division}'`;
    }
    con.query(sql, (err, data) => {
        if (err) {
            console.log(err);
            res.send({ msg: "failed" });
        } else if (data.length != 0) {
            // console.log(data);
            res.send({ msg: "success" });
        }
    })
}

module.exports = { getprogramlist, getsemanddiv, getsubjects, getsubjectID, insertpaperdetails, checkexistingpaper }