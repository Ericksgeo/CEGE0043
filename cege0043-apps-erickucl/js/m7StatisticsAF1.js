//Javascript to obtain the total of correct answered questions in all games

var correctAnsTotalNum;

function correctAnsTotal (httpsPortNumberAPI) {
    var serviceUrl = "https://developer.cege.ucl.ac.uk:" + httpsPortNumberAPI + "/correctAnsRequest/"+ httpsPortNumberAPI;
    console.log("calling for total of correct answered questions");
    $.ajax({
        url: serviceUrl,
        crossDomain: true,
        type: "GET",
        success: function(result) {

          correctAnsTotalNum = result[0].array_to_json[0].num_correct_questions
            console.log("The total number of questions answered correctly by the user " + httpsPortNumberAPI +" is: " + correctAnsTotalNum);
        },
    });
}

//Javascript to obtain the User Ranking
var userRankingVal;

function userRankingAns (httpsPortNumberAPI) {
    var serviceUrl = "https://developer.cege.ucl.ac.uk:" + httpsPortNumberAPI + "/userRankingRequest/"+ httpsPortNumberAPI;
    console.log("calling for user Ranking");
    var userRanking;
    $.ajax({
        url: serviceUrl,
        crossDomain: true,
        type: "GET",
        success: function(result) {
          userRanking = result[0].array_to_json[0].rank
            console.log("The Ranking for user " + httpsPortNumberAPI +" is: " + userRanking);
            userRankingVal= "The Ranking for user <br>" + httpsPortNumberAPI +" is: " + userRanking;
              document.getElementById("rank").innerHTML = userRankingVal;
        },
    });
}
