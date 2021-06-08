//javascript to clear questions and to clean map

//cleaning map for question deletion
function clean() {
  try {
      geoLoc.clearWatch(watchID);
  } catch (error) {
      console.log("error cleaning watchID, nothing to clean");
    }

try {
    mymap.removeLayer(current_position);
    mymap.removeLayer(current_accuracy);
} catch (error) {
    console.log("error cleaning current_position, nothing to clean");
  }

try {
    mymap.removeControl(legend);
} catch (error) {
    console.log("error cleaning legend, nothing to clean");
  }

try {
    mymap.off('click', onMapClick);
} catch (error) {
    console.log("error cleaning onMapClick, nothing to clean");
  }

  if (quiz2goQuestions) {
      mymap.removeLayer(quiz2goQuestions);
  }
}



//cleaning map for popup display
function cleanTracking() {
    try {
        geoLoc.clearWatch(watchID);
    } catch (error) {
    }

    try {
        geoloc.clearWatch(watchIDQuiz);;
    } catch (error) {
    }
}

//delete question record on DB using AJAX from popup delete button
function deleteRecord(selectedQuestionPoint) {
    var deleteID = selectedQuestionPoint;
    var deleteString = "id=" + deleteID + "&port_id=" + httpsPortNumberAPI;
    var serviceUrl = "https://developer.cege.ucl.ac.uk:" + httpsPortNumberAPI + "/deleteFormData";
    $.ajax({
        url: serviceUrl,
        crossDomain: true,
        type: "POST",
        success: function(data) {
            console.log(data);
            dataDeleted(data);
        },
        data: deleteString
    });
}


function dataDeleted(data) {
    document.getElementById("dataDeleteResult").innerHTML = JSON.stringify(data);
}
