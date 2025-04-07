const express = require('express');
const { verifyToken, fetchuserdetails, checkusertoken } = require('../Controllers/MainController');
const { getuserdetails, checkemail, sendotp, updatenewpass, logout } = require('../Controllers/LoginController');
const { getprogramlist, getsemanddiv, getsubjects, getsubjectID, insertpaperdetails, checkexistingpaper, } = require('../Controllers/SelectQuestionsController');
const { fetchstudentsbyprogramanddivandsem, insertstudentmarks, fetchstudentmarks } = require('../Controllers/InsertMarksController');
const { fetchreport, generatePDF, downloadPDF } = require('../Controllers/GenerateReportController');
const { fetchusertabledata, fetchcoursestabledata, fetchsubjectstabledata, insertuser, insertcourse, insertsubject, deleteuser, deletecourse, deletesubject, searchuser, searchcourse, searchsubject } = require('../Controllers/ManageUserController');
const { fetchAllStudent, insertStudent, deleteStudent, searchstudent } = require('../Controllers/ManageStudentController')

const router = express.Router();

router.get('/checkusertoken', checkusertoken);

router.get('/getuserdetails/:email/:password', getuserdetails);

router.get('/checkemail/:email', checkemail);

router.post('/sendotp', sendotp);

router.post('/updatenewpass', updatenewpass);

router.get('/fetchuserdetails', verifyToken, fetchuserdetails);

router.get('/getprogramlist', verifyToken, getprogramlist);

router.get('/getsemanddiv/:coursename', getsemanddiv);

router.get('/getsubjects/:semester/:courseid', getsubjects);

router.get('/getsubjectID/:subjectName', getsubjectID);

router.post('/insertpaperdetails', insertpaperdetails);

router.get('/checkexistingpaper/:programid/:subjectid/:division', checkexistingpaper);

router.get('/fetchstudentsbyprogramanddivandsem/:programid/:division', fetchstudentsbyprogramanddivandsem);

router.post('/insertstudentmarks', insertstudentmarks);

// router.get('/insertstudent', insertstudent);

router.get('/generatepdf/:subjectID/:division/:semester', generatePDF);

router.get('/downloadpdf/:subjectID/:division/:semester', downloadPDF);

router.get('/fetchstudentmarks/:studentid/:subjectid/:division', fetchstudentmarks);

router.get('/fetchreport/:subjectid/:division', fetchreport);

router.get('/fetchusertabledata', fetchusertabledata);

router.get('/fetchcoursestabledata', fetchcoursestabledata);

router.get('/fetchsubjectstabledata', fetchsubjectstabledata);

router.post('/insertuser', insertuser);

router.get('/searchuser/:username', searchuser);

router.post('/insertcourse', insertcourse);

router.post('/insertsubject', insertsubject);

router.get('/deleteuser/:userid', deleteuser);

router.get('/deletecourse/:programid', deletecourse);

router.get('/searchcourse/:coursename', searchcourse);

router.get('/deletesubject/:subjectid', deletesubject);

router.post('/searchsubject', searchsubject);

router.get('/fetchallstudent', fetchAllStudent);

router.post('/insertstudent', insertStudent);

router.post('/searchstudent', searchstudent);

router.get('/deletestudent/:rollno', deleteStudent);

router.get('/logout', logout);

module.exports = router;