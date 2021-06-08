//javascript to add question to the DB

//popup variable
var popup = L.popup();

//function to activate popup on map click
function onMapClick(e) {

    var lati = e.latlng.lat;
    var lngi = e.latlng.lng;

    var popupContent =
        '<div>' +
        '<label for="question_title">Question . Title:</label><input type="text" size="25" id="question_title" required/><br />' +
        '<label for="question_text">Insert Question:</label><input type="text" size="25" id="question_text" required/><br/>' +
        '<label for="answer_1">Insert answer 1:</label><input type="text" size="25" id="answer_1" required/><br/>' +
        '<label for="answer_2">Insert answer 2:</label><input type="text" size="25" id="answer_2" required/><br/>' +
        '<label for="answer_3">Insert answer 3:</label><input type="text" size="25" id="answer_3" required/><br/>' +
        '<label for="answer_4">Insert answer 4:</label><input type="text" size="25" id="answer_4" required/><br/>' +
        '<label for="correct_answer">Correct answer:</label><input type="number" step="1" min="1" max="4" pattern="\d+" id="correct_answer" required/><br/>' +
        '<label for=ttpsPortNumberAPI id="port_id">port ID: </label>' + ' ' + httpsPortNumberAPI + '<br/>' +
        '<label for=latini id="latini">lat: </label>' + lati + '<br/>' +
        '<label for=lngini id="lngini">lng: </label>' + lngi + '<br/>' +
        '<button id="startUpload" onclick="formTest(' + lati + ',' + lngi + ')">Start Data Upload</button>' +
        '<div id="dataUploadResult">Upload status:</div>' +
        '</div>';

    popup.setLatLng(e.latlng).setContent(popupContent).openOn(mymap);
    now(e.latlng);
    cleanTracking();
}

//console position monitoring
function now(latlng) {
    console.log(latlng.lat + " " + latlng.lng + " click position");
}

//Form Error Handling
//check for empty fields or wrong inserted format data
//General Code adapted from StackOverflow
function formTest(lat, lng) {
    var errormessage = "";

    if (document.getElementById("question_title").value == "") {
        errormessage += "enter the question title \n";
        document.getElementById('question_title').style.backgroundColor = "FCB3BC";
    }

    if (document.getElementById("question_text").value == "") {
        errormessage += "enter the question text \n";
        document.getElementById('question_text').style.backgroundColor = "FCB3BC";
    }

    if (document.getElementById("answer_1").value == "") {
        errormessage += "enter the answer 1 \n";
        document.getElementById('answer_1').style.backgroundColor = "FCB3BC";
    }

    if (document.getElementById("answer_2").value == "") {
        errormessage += "enter the answer 2 \n";
        document.getElementById('answer_2').style.backgroundColor = "FCB3BC";
    }

    if (document.getElementById("answer_3").value == "") {
        errormessage += "enter the answer 3 \n";
        document.getElementById('answer_3').style.backgroundColor = "FCB3BC";
    }

    if (document.getElementById("answer_4").value == "") {
        errormessage += "enter the answer 4 \n";
        document.getElementById('answer_4').style.backgroundColor = "FCB3BC";
    }

    if (document.getElementById("correct_answer").value == "") {
        errormessage += "enter the number of the correct answer \n";
        document.getElementById('correct_answer').style.backgroundColor = "FCB3BC";
    }

    if ((document.getElementById("correct_answer").value !== "1") &&
        (document.getElementById("correct_answer").value !== "2") &&
        (document.getElementById("correct_answer").value !== "3") &&
        (document.getElementById("correct_answer").value !== "4")) {
        errormessage += "enter the number of the correct answer between 1 to 4 \n";
        document.getElementById('correct_answer').style.backgroundColor = "FCB3BC";
    }

    console.log(document.getElementById("question_title").value)

//error message
    if (errormessage !== "") {
        alert(errormessage);
        return;
    } else {
        startDataUpload(lat, lng);
    }
}

//click event detector to the map
function addQuestion() {
    mymap.on('click', onMapClick);
}

//create Data upload string to the server dataAPI
function startDataUpload(lat, lng) {

    var question_title = document.getElementById("question_title").value;
    var question_text = document.getElementById("question_text").value;
    var answer_1 = document.getElementById("answer_1").value;
    var answer_2 = document.getElementById("answer_2").value;
    var answer_3 = document.getElementById("answer_3").value;
    var answer_4 = document.getElementById("answer_4").value;
    var correct_answer = document.getElementById("correct_answer").value;
    var lat = lat;
    var lng = lng;

    console.log(question_title + " " + question_text + " " + answer_1 + " " + answer_2 + " " + answer_3 + " " + answer_4 + " " + httpsPortNumberAPI + " " + correct_answer + " " + lat + " " + lng);

    var postString = "question_title=" + question_title + "&question_text=" + question_text + "&answer_1=" + answer_1 + "&answer_2=" + answer_2 + "&answer_3=" + answer_3 + "&answer_4=" + answer_4 + "&port_id=" + httpsPortNumberAPI + "&correct_answer=" + correct_answer + "&latitude=" + lat + "&longitude=" + lng;

    console.log(postString);

    processData(postString);

} // close off the startDataUpload function

//AJAX data upload to the server (for created questions)
function processData(postString) {
    var serviceUrl = "https://developer.cege.ucl.ac.uk:" + httpsPortNumberAPI + "/insertFormData"
    console.log(postString);
    $.ajax({
        url: serviceUrl,
        crossDomain: true,
        type: "POST",
        success: function(data) {
            console.log(data);
            dataUploaded(data);
        },
        data: postString
    });
}

// Checker if data was uploaded correctly.
function dataUploaded(data) {
  dataUploadResult.innerHTML = "Question was uploaded correctly";
    console.log(data + "uploaded");
}
