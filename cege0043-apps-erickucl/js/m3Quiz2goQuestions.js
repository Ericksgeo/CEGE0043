//javascript for Quiz questions markers and popups

//Global marker layer
var quiz2goQuestions, markerQuiz2go, markerCorrect, markerWrong, markerOthers;

//get questions layer from server
function getQuizQuestionsLayer(e, selector) {

    //clear old layer
    if (quiz2goQuestions) {
        mymap.removeLayer(quiz2goQuestions);
    }

    // define custom markers
    markerQuiz2go = L.AwesomeMarkers.icon({
        icon: 'ion-ios-help-circle',
        markerColor: 'cadetblue'
    });
    markerClick = L.AwesomeMarkers.icon({
        icon: 'ion-ios-help-circle',
        markerColor: 'pink'
    });
    markerCorrect = L.AwesomeMarkers.icon({
        icon: 'ion-ios-help-circle',
        markerColor: 'green'
    });
    markerWrong = L.AwesomeMarkers.icon({
        icon: 'ion-ios-help-circle',
        markerColor: 'red'
    });
    markerOthers = L.AwesomeMarkers.icon({
        icon: 'ion-ios-help-circle',
        markerColor: 'black'
    });

    // layerURL selector to quiz questions or questions added last week from all users
    if (selector =="quiz"){
    var layerURL =
        "https://developer.cege.ucl.ac.uk:" + httpsPortNumberAPI + "/getGeoJSON2/quizquestions/location/" + httpsPortNumberAPI;
      }
    if (selector =="lastWeek"){
    var layerURL =
            "https://developer.cege.ucl.ac.uk:" + httpsPortNumberAPI + "/questionsLastWeek";
      }
    if (selector =="5Closest"){
      var layerURL =
              "https://developer.cege.ucl.ac.uk:" + httpsPortNumberAPI + "/closestQuestions/"+userlat+"/"+userlng;
      }

    if (selector =="lastQuestions"){
        var layerURL =
                "https://developer.cege.ucl.ac.uk:" + httpsPortNumberAPI + "/lastQuestions/"+httpsPortNumberAPI;
        }

    if (selector =="notCompletedQuestions"){
        var layerURL =
                    "https://developer.cege.ucl.ac.uk:" + httpsPortNumberAPI + "/notCompletedQuestions/"+httpsPortNumberAPI;
            }


    $.ajax({
        url: layerURL,
        crossDomain: true,
        success: function(result) {
            console.log(result);

            // load the geoJSON layer
            quiz2goQuestions = L.geoJson(result, {
                // use point to layer to create the points
                pointToLayer: function(feature, latlng) {
                    var id = feature.properties.id;
                    var question_title = feature.properties.question_title;
                    var question_text = feature.properties.question_text;
                    var answer_1 = feature.properties.answer_1;
                    var answer_2 = feature.properties.answer_2;
                    var answer_3 = feature.properties.answer_3;
                    var answer_4 = feature.properties.answer_4;
                    var correct_answer = feature.properties.correct_answer;
                    var port_id = feature.properties.port_id;
                    var answer_correct = feature.properties.answer_correct;

                    //string creation for question component popup
                    //button to delete question inside popup
                    var popupQuesC = '<div>' + '<label for=id id="id">Question ID: </label>' + id + '<br/>' +
                        '<label for=question_title id="question_title">Question Title: </label>' + question_title + "<br/>" +
                        '<label for=question_text id="question_text">Question Text: </label>' + question_text + '<br/>' +
                        '<label for=question_text id="answer_1Ans">answer 1: </label>' + answer_1 + '<br/>' +
                        '<label for=question_text id="answer_2Ans">answer 2: </label>' + answer_2 + '<br/>' +
                        '<label for=question_text id="answer_3Ans">answer 3: </label>' + answer_3 + '<br/>' +
                        '<label for=question_text id="answer_4Ans">answer 4: </label>' + answer_4 + '<br/>' +
                        '<button id="deleteRecordBtn" onclick="deleteRecord(' + id + ')">Delete Question</button>' +
                        '<div id="dataDeleteResult">Delete status:</div>' +
                        '</div>';

                    //string creation for quiz component popup
                    var popupQuizC = '<div>' +
                        '<p>' + question_text + '<p/><br/>' +
                        '<input type="radio" name="answerSelector" id="answer_1Ans" />' + ' ' + answer_1 + '<br/>' +
                        '<input type="radio" name="answerSelector" id="answer_2Ans" />' + ' ' + answer_2 + '<br/>' +
                        '<input type="radio" name="answerSelector" id="answer_3Ans" />' + ' ' + answer_3 + '<br/>' +
                        '<input type="radio" name="answerSelector" id="answer_4Ans" />' + ' ' + answer_4 + '<br/>' +
                        '<button id="uploadAnswer" onclick="startAnsUpload();">Send Answer</button>' +
                        '<div id="AnswerResult">failed or passed?:</div>' +
                        '</div>' +
                        '<div hidden id="port_idAns">' + port_id + '</div>' +
                        '<div hidden id="idAns">' + id + '</div>' +
                        '<div hidden id="correct_answerAns">' + correct_answer + '</div>';

                    // popup selection according to the loaded component
                    if (e == 'questionComponent') {
                        cleanTracking();
                        return L.marker(latlng, {
                            icon: markerQuiz2go
                        }).bindPopup(popupQuesC);

                    }
                    if(e=='quizComponent') {
                        cleanTracking();
                        return L.marker(latlng, {
                            icon: markerOthers
                        }).on('popupclose', function(e) {
                            if (iconAnswer === 1) {
                                e.target.setIcon(markerCorrect)
                            } else {
                              e.target.setIcon(markerWrong)
                            }
                        }).bindPopup(popupQuizC);

                        return
                    }

                    if(e=='lastComponent') {
                        cleanTracking();
                        return L.marker(latlng, {
                            icon: markerOthers
                        }).on('add', function(e) {
                            if (answer_correct === true) {
                                e.target.setIcon(markerCorrect)
                            } else {
                              e.target.setIcon(markerWrong)
                            }
                        }).bindPopup(popupQuizC);

                        return
                    }
                }, // end of point to layer
            }).addTo(mymap);

            // change the map zoom so that all the data is shown
            mymap.fitBounds(quiz2goQuestions.getBounds());
        }, // end of the inner function
    }); // end of the ajax request
} // end of the function
