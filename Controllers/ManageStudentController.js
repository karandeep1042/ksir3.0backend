const mysql = require('mysql2');

const con = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "ksir",
    insecureAuth: true
});

const fetchAllStudent = (req, res) => {
    let sql = `SELECT s.student_rollno,s.student_semester,s.student_division,p.program_name FROM STUDENTS as s inner join program as p on s.student_program = p.program_id`
    con.query(sql, (err, data) => {
        if (err) {
            console.log(err);
            res.json({ fetched: false })
        } else if (data.length > 0) {
            res.json({ fetched: true, data })
        }
    })
}

const insertStudent = (req, res) => {
    let { firstrollno, lastrollno, programID, division, semester } = req.body;
    semester = parseInt(semester);
    let arr = [];
    for (let i = firstrollno; i <= lastrollno; i++) {
        arr.push([i, programID, division, semester]);
    }

    let sql = `INSERT INTO students (student_rollno,student_program,student_division,student_semester) VALUES ?`;
    con.query(sql, [arr], (err, data) => {
        if (err) {
            console.log(err);
            res.send({ inserted: false })
        } else {
            console.log(data);
            res.send({ inserted: true })
        }
    })
}

const deleteStudent = (req, res) => {
    let sql = `DELETE FROM STUDENTS WHERE student_rollno=${req.params.rollno}`;
    con.query(sql, (err, data) => {
        if (err) {
            console.log(err);
            res.send({ deleted: false })
        } else {
            console.log(data);
            res.send({ deleted: true })
        }
    })
}

const searchstudent = (req, res) => {
    let { courseID, semester, division } = req.body;
    let sql;
    console.log(semester);
    courseID = parseInt(courseID);
    if (semester != null) {
        semester = parseInt(semester);
    }
    if (courseID != null && semester == null && division == null) {
        sql = `select s.student_rollno,s.student_division,s.student_semester,d.program_name from students as s inner join program as d on s.student_program=d.program_id where s.student_program=${courseID}`
    } else if (courseID != null && semester != null && division == null) {
        sql = `select s.student_rollno,s.student_division,s.student_semester,d.program_name from students as s inner join program as d on s.student_program=d.program_id where s.student_program=${courseID} AND s.student_semester=${semester}`
    } else if (courseID != null && semester == null && division != null) {
        sql = `select s.student_rollno,s.student_division,s.student_semester,d.program_name from students as s inner join program as d on s.student_program=d.program_id where s.student_program=${courseID} AND s.student_division='${division}'`
    } else if (courseID != null && semester != null && division != null) {
        sql = `select s.student_rollno,s.student_division,s.student_semester,d.program_name from students as s inner join program as d on s.student_program=d.program_id where s.student_program=${courseID} AND s.student_semester=${semester} AND s.student_division='${division}'`
    } else if (courseID == null && semester == null && division == null) {
        sql = `select s.student_rollno,s.student_division,s.student_semester,d.program_name from students as s inner join program as d on s.student_program=d.program_id`
    }

    con.query(sql, (err, data) => {
        if (err) {
            console.log(err);
            res.json({ fetched: false });
        } else if (data.length > 0) {
            res.json({ fetched: true, data, msg: 'datafound' });
        } else if (data.length == 0) {
            res.json({ fetched: true, data, msg: 'nodata' });
        }
    })
}

module.exports = { fetchAllStudent, insertStudent, deleteStudent, searchstudent }