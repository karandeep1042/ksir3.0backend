const mysql = require('mysql2');
const chromium = require('@sparticuz/chromium');
const puppeteer = require('puppeteer');
const path = require('path');
require('dotenv').config();
const con = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    insecureAuth: true
});

const fetchreport = (req, res) => {
    let sql = `select student_rollno,score,Q1,Q2,Q3,Q4,Q5,Q6,attaintment from marks where subject_id=${req.params.subjectid} AND division='${req.params.division}'`

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

const generatePDF = async (req, res) => {
    console.log(req.params.subjectID);
    let sql = `select student_rollno,score,Q1,Q2,Q3,Q4,Q5,Q6,attaintment from marks where subject_id=${req.params.subjectID} AND division='${req.params.division}'`
    con.query(sql, (err, data) => {
        if (err) {
            console.log(err);
        } else if (data.length != 0) {
            let sql2 = `select subject_name,semester from subjects where subject_id=${req.params.subjectID}`
            con.query(sql2, (err, data2) => {
                if (err) {
                    console.log(err);
                } else {
                    let totalscore = 0;
                    for (let i = 0; i < data.length; i++) {
                        let elescore = 0;
                        if (data[i].Q1 > 0) {
                            elescore++;
                        } else { }
                        if (data[i].Q2 > 0) {
                            elescore++;
                        }
                        if (data[i].Q3 > 0) {
                            elescore++;
                        }
                        if (data[i].Q4 > 0) {
                            elescore++;
                        }
                        if (data[i].Q5 > 0) {
                            elescore++;
                        }
                        if (data[i].Q6 > 0) {
                            elescore++;
                        }
                        data[i].score = elescore;
                        data[i].attaintment = (elescore / 6).toFixed(2);
                        totalscore += elescore;
                    }
                    let finalscore = (totalscore / (6 * data.length)).toFixed(2);
                    console.log(finalscore);

                    res.render('layout', { data: data, semester: data2[0].semester, division: 'A', subject: data2[0].subject_name, finalscore: finalscore });
                }
            })
        } else if (data.length == 0) {
            res.send({ msg: "empty" });
        }
    })
}

const downloadPDF = async (req, res) => {
    const isProd = process.env.NODE_ENV === 'production';

    let browser;
    try {
        if (isProd) {
            const chromium = require('@sparticuz/chromium');
            const puppeteer = require('puppeteer');

            browser = await puppeteer.launch({
                args: chromium.args,
                executablePath: await chromium.executablePath(),
                headless: chromium.headless,
            });
        } else {
            const puppeteer = require('puppeteer');

            browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
            });
        }

        const page = await browser.newPage();

        await page.goto(`https://ksir3-0backend.onrender.com/generatepdf/${req.params.subjectID}/${req.params.division}/${req.params.semester}`, {
            waitUntil: "networkidle2"
        });

        page.setViewport({ width: 1920, height: 1080 });

        const todaydate = new Date();
        const filename = todaydate.getTime() + ".pdf";
        const pdfPath = path.join(__dirname, '../files', filename);

        await page.pdf({
            path: pdfPath,
            printBackground: true,
            format: "A4"
        });

        await browser.close();

        res.download(pdfPath, (err) => {
            if (err) {
                console.log("Download error:", err);
                res.status(500).send("Could not download the file.");
            }
        });

    } catch (error) {
        console.log("PDF generation error:", error.message);
        res.status(500).send("Failed to generate PDF.");
        if (browser) await browser.close();
    }
};

module.exports = { fetchreport, generatePDF, downloadPDF }