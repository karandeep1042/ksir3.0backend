const mysql = require('mysql2');

const con = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "ksir",
    insecureAuth: true
});

const fetchusertabledata = (req, res) => {
    let sql = `SELECT * from user where adminpermission=0`;

    con.query(sql, (err, data) => {
        if (err) {
            console.log(err);
            res.json({ err });
        } else {
            res.json({ data });
        }
    })
}

const fetchcoursestabledata = (req, res) => {
    let sql = `SELECT * from program`;

    con.query(sql, (err, data) => {
        if (err) {
            console.log(err);
            res.json({ err });
        } else {
            res.json({ data });
        }
    })
}

const fetchsubjectstabledata = (req, res) => {
    let sql = `select subjects.subject_id,subjects.subject_name,subjects.semester,program.program_name from subjects inner join program on subjects.program_id=program.program_id`;

    con.query(sql, (err, data) => {
        if (err) {
            console.log(err);
            res.json({ err });
        } else {
            res.json({ data });
        }
    })
}

const insertuser = (req, res) => {
    let { name, email, pass } = req.body;
    let sql = `INSERT INTO USER (user_name,user_email,user_password,adminpermission) values ('${name}','${email}','${pass}',0)`;

    con.query(sql, (err, data) => {
        if (err) {
            console.log(err);
            res.json({ inserted: false });
        } else if (data.affectedRows > 0) {
            res.json({ inserted: true });
        }
    })
}

const insertcourse = (req, res) => {
    let { name, semesters, divisions } = req.body;
    let sql = `INSERT INTO PROGRAM (program_name,program_semesters,program_divisions) values ('${name}',${semesters},${divisions})`;

    con.query(sql, (err, data) => {
        if (err) {
            console.log(err);
            res.json({ inserted: false });
        } else if (data.affectedRows > 0) {
            res.json({ inserted: true });
        }
    })
}

const insertsubject = (req, res) => {
    let { name, programid, semester } = req.body;

    let sql = `SELECT * from subjects where subject_name='${name}' AND semester=${semester} AND program_id=${programid}`;

    con.query(sql, (err, data) => {
        if (err) {
            console.log(err);
            res.json({ inserted: false });
        } else if (data.length == 0) {
            let sql2 = `INSERT INTO subjects (subject_name,semester,program_id) values ('${name}',${semester},${programid})`;
            con.query(sql2, (err2, data2) => {
                if (err2) {
                    console.log(err2);
                    res.json({ inserted: false });
                } else if (data2.affectedRows > 0) {
                    res.json({ inserted: true });
                }
            })
        } else {
            res.json({ inserted: false });
        }
    })
}

const deleteuser = (req, res) => {
    let sql = `DELETE FROM user where user_id=${req.params.userid}`
    con.query(sql, (err, data) => {
        if (err) {
            console.log(err);
            res.json({ deleted: false });
        } else if (data.affectedRows > 0) {
            res.json({ deleted: true });
        }
    })
}

const deletecourse = (req, res) => {
    console.log(req.params.programid);

    let sql = `DELETE FROM program where program.program_id=${req.params.programid}`
    con.query(sql, (err, data) => {
        if (err) {
            console.log(err);
            res.json({ deleted: false });
        } else if (data.affectedRows > 0) {
            res.json({ deleted: true });
        }
    })
}

const deletesubject = (req, res) => {
    let sql = `DELETE FROM subjects where subject_id=${req.params.subjectid}`
    con.query(sql, (err, data) => {
        if (err) {
            console.log(err);
            res.json({ deleted: false });
        } else if (data.affectedRows > 0) {
            res.json({ deleted: true });
        }
    })
}

const searchuser = (req, res) => {
    let sql = `SELECT * FROM user where user_name LIKE '%${req.params.username}%' AND adminpermission=0`;
    con.query(sql, (err, data) => {
        if (err) {
            console.log(err);
            res.json({ fetched: false });
        } else if (data.length > 0) {
            res.json({ fetched: true, data });
        }
    })
}

const searchcourse = (req, res) => {
    let sql = `SELECT * FROM program where program_name LIKE '%${req.params.coursename}%'`;
    con.query(sql, (err, data) => {
        if (err) {
            console.log(err);
            res.json({ fetched: false });
        } else if (data.length > 0) {
            res.json({ fetched: true, data });
        }
    })
}

const searchsubject = (req, res) => {
    let { courseID, semester, subjectName } = req.body;
    let sql;

    if (courseID && semester == null && subjectName == '') {
        console.log("fetch by course");
        sql = `SELECT * from subjects inner join program on subjects.program_id=program.program_id where program.program_id=${courseID}`
    } else if (courseID != null && semester != null && subjectName == '') {
        console.log("fetch by course and sem");
        sql = `SELECT * from subjects inner join program on subjects.program_id=program.program_id where program.program_id=${courseID} AND semester=${semester}`
    } else if (courseID != null && semester != null && subjectName != '') {
        console.log("fetch by course and sem and name");
        sql = `SELECT * from subjects inner join program on subjects.program_id=program.program_id where program.program_id=${courseID} AND semester=${semester} AND subject_name LIKE '%${subjectName}%' `
    } else if (courseID != null && semester == null && subjectName != '') {
        console.log("fetch by course and name");
        sql = `SELECT * from subjects inner join program on subjects.program_id=program.program_id where program.program_id=${courseID} AND subject_name LIKE '%${subjectName}%'`
    } else if (courseID == null && semester == null && subjectName != '') {
        console.log("fetch by name");
        sql = `SELECT * from subjects inner join program on subjects.program_id=program.program_id where subject_name LIKE '%${subjectName}%'`
    } else if (courseID == null && semester == null && subjectName == '') {
        sql = `SELECT * from subjects inner join program on subjects.program_id=program.program_id`
        console.log("default");
    }

    con.query(sql, (err, data) => {
        if (err) {
            console.log(err);
            res.json({ fetched: false });
        } else if (data.length > 0) {
            res.json({ fetched: true, data });
        } else if (data.length == 0) {
            res.json({ fetched: false, data });
        }
    })

}

module.exports = { fetchusertabledata, fetchcoursestabledata, fetchsubjectstabledata, insertuser, insertcourse, insertsubject, deleteuser, deletecourse, deletesubject, searchuser, searchcourse, searchsubject }