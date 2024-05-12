function handleFile(event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const excelData1 = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    let questionsA = [];

    const sortedArray = excelData1.sort((a, b) => a.length - b.length);

    // Filter out the empty arrays
    const excelData = sortedArray.filter((arr) => arr.length > 0);

    console.log(excelData);

    if (excelData) {
      for (i = 1; i < excelData.length; i++) {
        objQuestion = {};
        objQuestion.id = excelData[i][0];
        objQuestion.question = excelData[i][1];
        let optionsArr = excelData[i][2];
        if(optionsArr){
            objQuestion.options = optionsArr.split(" / ");
            let answersArr = excelData[i][3].split(",");
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
        }
        questionsA.push(objQuestion);
      }
    }
    storeQuestions(questionsA);
  };

  reader.readAsArrayBuffer(file);
}

function storeQuestions(questions) {
  // Save score to localStorage for access on the score page
  localStorage.removeItem("questions");
  localStorage.setItem("questions",  JSON.stringify(questions));
 
  // Redirect to the score page
  window.location.href = "quiz.html";
}
