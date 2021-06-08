//javascript to initialise location cleanTracking
// code extracted from practicals week 4

//global variables
var current_position, current_accuracy, userlat, userlng, geoloc;

// function to extract the navigator geolocation with Error Handling in case that location is unavailable
function currentPosition() {
    if (navigator.geolocation) {
      geoLoc = navigator.geolocation;
watchID = geoLoc.watchPosition(plotLocation);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

// function to insert current location in the map as a marker, and accuracy
function plotLocation(position) {
    console.log('Plotting location');
    userlng = position.coords.longitude;
    userlat = position.coords.latitude;

    // custom icon
    var testMarkerblue = L.AwesomeMarkers.icon({
        icon: 'play',
        markerColor: 'blue'
    });

    // define location marker
    var current_positionPoint = {
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [userlng, userlat]
        }
    };

// cleaning old position
    if (current_position) {
        console.log('removing previous layer.');
        mymap.removeLayer(current_position);
        mymap.removeLayer(current_accuracy);
    }


    console.log('adding current_position [' + position.coords.latitude + ',' +
        position.coords.longitude + '] to map.');

// accuracy calculation and display to map
    var radius = position.coords.accuracy / 2;
    console.log('adding accuracy circle [' + radius + ',' +
        position.coords.latitude + ',' + position.coords.longitude + '] to map.');
    current_accuracy = L.circle([position.coords.latitude, position.coords.longitude], radius).addTo(mymap);

    // position point and display to map
    current_position = L.geoJson(current_positionPoint, {
        pointToLayer: function(feature, latlng) {
            d = new Date();
            return L.marker(latlng, {
                    icon: testMarkerblue
                })
                .bindPopup("Position accuracy of " + Math.round(radius) + "m aproximately.").openPopup();
        },
    }).addTo(mymap);

    console.log(userlat + " " + userlng);

//fit to screen
    mymap.fitBounds(current_position.getBounds());
}
