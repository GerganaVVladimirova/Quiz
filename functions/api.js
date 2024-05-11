const express = require("express");
const multer = require("multer");
const { promisify } = require("util");
const app = express();
const port = 3000;
const serverless = require('serverless-http');
const router = express.Router();

const fs = require("fs");
const xlsx = require("xlsx");
const unlinkAsync = promisify(fs.unlink);


// Serve static files from the "public" directory
app.use(express.static("../dist"));

let excelFilePath = '';
let exam = 0;
let questions = [];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage }).single("file");

router.post('/upload', upload, async (req, res) => {
 
  exam = req.body.picker;
  excelFilePath = req.file.path; // Save the path of the uploaded file

  const workbook = xlsx.readFile(excelFilePath);

  let sheetNumber = Number(exam)-1;
  
  const sheetName = workbook.SheetNames[sheetNumber]; 
  const sheet = workbook.Sheets[sheetName];

  // Parse the sheet data into JSON format
  const excelData = xlsx.utils.sheet_to_json(sheet);

  if (excelData) {
    for (i = 0; i < excelData.length; i++) {
      objQuestion = {};
      objQuestion.id = excelData[i].id;
      objQuestion.question = excelData[i].body;
      let optionsArr = excelData[i]["all answers"];
      objQuestion.options = optionsArr.split(" / ");
      let answersArr = excelData[i]["correct answers"].split(",");
      objQuestion.answers = [];
      for (let x = 0; x < answersArr.length; x++) {
        if (answersArr[x] === "1") {
          objQuestion.answers.push(objQuestion.options[x]);
          if (objQuestion.answers.length > 1) {
            objQuestion.multiple = true;
          } else {
            objQuestion.multiple = false;
          }
        }
      }
      questions.push(objQuestion);
    }
  }

  await unlinkAsync(req.file.path);

  // res.redirect('quiz.html');
});

router.get('/questions',(req,res)=>{
  // console.log(questions)
  if(questions){
    res.json({questions});
  }
});

router.post("/delete", async(req,res)=>{
  if(questions){
    questions = [];
  } 
  res.end("deleted");

})

app.use('/.netlify/functions/api', router);
module.exports.handler = serverless(app);


// app.listen(port, () => {
//   console.log(`Server listening at http://localhost:${port}`);
// });
