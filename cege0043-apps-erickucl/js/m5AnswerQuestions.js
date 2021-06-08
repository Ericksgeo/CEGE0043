//javascript to answer quiz
//send questions to DB
// check questions correct incorrect

//global variables
var popupAnswer = 0;
var acumCorrect = 0;
var acumWrong = 0;
var correct_answerAns, iconAnswer;

//loading information from the popup form
function startAnsUpload() {
    console.log("Start data upload");

    var port_idAns = document.getElementById("port_idAns").innerHTML;
    var question_idAns = document.getElementById("idAns").innerHTML;
    correct_answerAns = document.getElementById("correct_answerAns").innerHTML;

    console.log("Start data upload for port: " + port_idAns + " answering question Id: " + question_idAns);

    //string creation for questions
    var postStringAns = "port_id=" + port_idAns + "&question_id=" + question_idAns;

    //check radio selection from quiz Popup
    if (document.getElementById("answer_1Ans").checked) {
        popupAnswer = 1;
        postStringAns = postStringAns + "&answer_selected=1";
    }
    if (document.getElementById("answer_2Ans").checked) {
        popupAnswer = 2;
        postStringAns = postStringAns + "&answer_selected=2";
    }
    if (document.getElementById("answer_3Ans").checked) {
        popupAnswer = 3;
        postStringAns = postStringAns + "&answer_selected=3";
    }
    if (document.getElementById("answer_4Ans").checked) {
        popupAnswer = 4;
        postStringAns = postStringAns + "&answer_selected=4";
    }

    postStringAns = postStringAns + "&correct_answer=" + correct_answerAns;

    console.log(postStringAns);

    processDataAns(postStringAns);

}

//send the answer to DB with AJAX
function processDataAns(postStringAns) {
    var serviceUrl = "https://developer.cege.ucl.ac.uk:" + httpsPortNumberAPI + "/insertAnsData"
    console.log(postStringAns);
    $.ajax({
        url: serviceUrl,
        crossDomain: true,
        type: "POST",
        success: function(data) {
            console.log(data);
            dataUploadedAns();
        },
        data: postStringAns
    });
}

// create the code to process the response from the data server
//adding AJAX to wait for the async response
function dataUploadedAns() {
    if (popupAnswer == correct_answerAns) {

        $.ajax({
            url: correctAnsTotal(httpsPortNumberAPI),
            success: function() {
                iconAnswer = 1;
                popupAnswer = 0;
                acumCorrect = acumCorrect + 1;
                document.getElementById("AnswerResult").innerHTML = "<p>Your answer was correct!<br>Your correct answers for this game are " + acumCorrect +
                    "<br>Your wrong answers for this game are " + acumWrong +
                    "<br>The total number of questions answered correctly by this user is " + correctAnsTotalNum + "</p>";
                //start proximity again
                watchIDQuiz = navigator.geolocation.watchPosition(proximityPoint);
            }
        })
    } else {
        $.ajax({
            url: correctAnsTotal(httpsPortNumberAPI),
            success: function() {
                correctAnsTotal(httpsPortNumberAPI);
                iconAnswer = 2;
                popupAnswer = 0;
                acumWrong = acumWrong + 1;
                document.getElementById("AnswerResult").innerHTML = "<p>Your answer was wrong!<br>Your wrong answers for this game are " + acumCorrect +
                    "<br>Your wrong answers for this game are " + acumWrong +
                    "<br>The total number of questions answered correctly by this user is " + correctAnsTotalNum + "</p>";
                //start proximity again
                watchIDQuiz = navigator.geolocation.watchPosition(proximityPoint);
            }
        })
    }
}
