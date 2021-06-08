//javascript to start quiz proximity, functions to calculate distance and popup QUESTIONS
//replace old m6Proximity.js


function proximityPoint() {
    // take the leaflet formdata layer
    // go through each point one by one
    // and measure the distance to user location
    // for the closest point show the pop up of that point
    // extracted from practical code week 4


    var minDistance = 8;
    var closestFormPoint = 0;
    // for this example, use the latitude/longitude of warren street
    // in your assignment replace this with the user's location
    console.log("inside closestFormPoint function>" + userlat + " " + userlng);

    quiz2goQuestions.eachLayer(function(layer) {
      var distance = calculateDistance(userlat,
            userlng, layer.getLatLng().lat, layer.getLatLng().lng, 'M');
        console.log("distance to the point: " + distance);
        if (distance < minDistance) {
            minDistance = distance;
            closestFormPoint = layer.feature.properties.id;
        }
    });
    // for this to be a proximity alert, the minDistance must be
    // closer than a given distance - you can check that here
    // using an if statement
    // show the popup for the closest point
    quiz2goQuestions.eachLayer(function(layer) {
        if (layer.feature.properties.id == closestFormPoint) {
            cleanTracking();
            layer.openPopup();
      }
});
}//code adapted from https: //www.htmlgoodies.com/beyond/javascript/calculate-the-distance-between-two-points-in-your - web - apps.html

//calculate distance between current location and questions layer points
function calculateDistance(lat1, lon1, lat2, lon2, unit) {
    var radlat1 = Math.PI * lat1 / 180;
    var radlat2 = Math.PI * lat2 / 180;
    var radlon1 = Math.PI * lon1 / 180;
    var radlon2 = Math.PI *
        lon2 / 180;
    var theta = lon1 - lon2;
    var radtheta = Math.PI * theta / 180;
    var subAngle = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) *
        Math.cos(radtheta);
    subAngle = Math.acos(subAngle);
    subAngle = subAngle * 180 / Math.PI;
    // convert the degree value returned by acos back to degrees from radians
    dist = (subAngle / 360) * 2 * Math.PI * 3956;
    //     ((subtended angle in degrees)/360)* 2 * pi * radius)
    // where radius of the earth is 3956 miles
    if (unit == "M") {
        dist = dist * 1609.344;
    }
    // convert miles to km
    if (unit == "N") {
        dist = dist * 0.8684;
    } // convert miles to nautical miles
    return dist;
}

//start quiz function, from HTML Call
function startQuiz() {
  currentPosition();
  getQuizQuestionsLayer('quizComponent','quiz');
setTimeout(() => {
  //little delay to allow map loading (problem in chrome sometimes)
watchIDQuiz = navigator.geolocation.watchPosition(proximityPoint) }, 2000);
}

//start quiz function to complete just not previously answered questions
function startQuizNotCompleted() {
  currentPosition();
  getQuizQuestionsLayer('quizComponent','notCompletedQuestions');
setTimeout(() => {
  //little delay to allow map loading (problem in chrome sometimes)
watchIDQuiz = navigator.geolocation.watchPosition(proximityPoint) }, 2000);
}
