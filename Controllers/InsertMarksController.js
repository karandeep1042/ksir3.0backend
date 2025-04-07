const mysql = require('mysql2');
const con = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "ksir",
    insecureAuth: true
});

const fetchstudentsbyprogramanddivandsem = (req, res) => {
    const { programID, division, semester } = req.body
    let sql = `select student_rollno from students where student_program=${req.params.programid} AND student_division='${req.params.division}';`
    con.query(sql, (err, data) => {
        if (err) {
            console.log(err);
            // res.send({ msg: "failed" });
        } else if (data.length != 0) {
            console.log(data);
            res.send(data);
        }
    })
}

const insertstudentmarks = (req, res) => {
    const { m1, m2, m3, m4, m5, m6, score, attaintment, rollno, subject, division } = req.body
    console.log("score=" + score);

    let sql = `select * from marks where student_rollno=${rollno} AND subject_id=${subject} AND division='${division}'`

    con.query(sql, (err, data) => {
        if (err) {
            console.log(err);
        } else if (data.length != 0) {
            console.log(data);
            let sql2 = `update marks set Q1=${m1},Q2=${m2},Q3=${m3},Q4=${m4},Q5=${m5},Q6=${m6},score=${score},attaintment=${attaintment} where student_rollno=${rollno} AND subject_id=${subject} AND division='${division}'`
            con.query(sql2, (err, data) => {
                if (err) {
                    console.log(err);
                    res.send({ msg: "failed" });
                } else {
                    console.log(data);
                    res.send({ msg: "success" });
                }
            })
        } else if (data.length == 0) {
            let sql2 = `insert into marks values(${m1},${m2},${m3},${m4},${m5},${m6},${score},${rollno},${subject},'${division}',${attaintment})`
            con.query(sql2, (err, data) => {
                if (err) {
                    console.log(err);
                    res.send({ msg: "failed" });
                } else {
                    console.log(data);
                    res.send({ msg: "success" });
                }
            })
        }
    })
}

const fetchstudentmarks = (req, res) => {
    let sql = `select Q1,Q2,Q3,Q4,Q5,Q6 from marks where student_rollno=${req.params.studentid} AND subject_id=${req.params.subjectid} AND division='${req.params.division}'`

    con.query(sql, (err, data) => {
        if (err) {
            console.log(err);
        } else if (data.length != 0) {
            console.log(data);
            res.send(data);
        } else if (data.length == 0) {
            res.send({ msg: "empty" });
        }
    })
}

module.exports = { fetchstudentsbyprogramanddivandsem, insertstudentmarks, fetchstudentmarks }