//JavaScript to load base map.
//code extracted from week2 practical sessions

L.AwesomeMarkers.Icon.prototype.options.prefix = 'ion';

// code to load map when the page is loaded
document.addEventListener('DOMContentLoaded', function() {
    loadMap();
}, false);

function loadMap() {
    getPorts();
    loadLeafletMap();
}


function loadLeafletMap() {
    mymap = L.map('mapid').setView(
        [51.52, -0.13],
        18); {
        console.log(
            'map loaded'
        );
    }
    // load the tiles
    L.tileLayer(
        'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
            maxZoom: 21,
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
                '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                'Imagery © <a href="http://mapbox.com">Mapbox</a>',
            id: 'mapbox.streets'
        }).addTo(mymap);

        //Load statistics and call for participation rate. Also call for geoJSON 
            userScoresQuiz();
            participationRate1();
            participationRate2();
            hardestQuestions();

} //end code to add the leaflet map
