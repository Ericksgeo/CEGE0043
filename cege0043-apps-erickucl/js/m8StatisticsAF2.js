//Javascript to obtain top 5 scorers in the quiz  (ADVANCE FUNCTIONALITY 2)
var userScoresQuizJson, legend;
var labels = "";

// function of ajax call to obtain the 5 top scorers.
//loaded at the m0LoadMap.js file, in the loading map. To avoid delays.
function userScoresQuiz() {
    var serviceUrl = "https://developer.cege.ucl.ac.uk:" + httpsPortNumberAPI + "/userScoresQuiz";
    console.log("calling to obtain top 5 scorers in the quiz");
    $.ajax({
        url: serviceUrl,
        crossDomain: true,
        type: "GET",
        success: function(result) {
            //getting the json information without main envelop
            userScoresQuizJson = result[0].array_to_json;
            console.log(userScoresQuizJson)
        },
    });
}

//function to create legend box in Leaflet. To append all the statistics graphs.
//legend for d3 graph https://gis.stackexchange.com/questions/133630/adding-leaflet-legend
function createLegend() {

    //try to clean old legendbox
    try {
        mymap.removeControl(legend);
    } catch (err) {
        console.log(err.message);
    }

    //legend variable to add l.control
    legend = L.control({
        position: 'bottomleft'
    });
    legend.onAdd = function(map) {

        var div = L.DomUtil.create('divleg', 'info_legend');

        //add legend title ccording to the statistic called
        div.innerHTML = labels.join('<br>');
        return div;
    };
    legend.addTo(mymap);
}

//create graph for 5 top scorers. Simple graph
//start creating the D3 graph from D3.js
function createScoreGraph(data) {
    console.log("The top 5 scorers in the quiz are: |" + data);
    var data2 = data;
    console.log("data2 variable: |" + data2);
    // Create an empty (detached) chart container.
    const div = d3.select(".info_legend");

    // Apply some styles to the chart container.
    div.style("font", "12px arial");
    div.style("text-align", "middle");
    div.style("color", "black");

    // Define the initial (empty) selection for the bars.
    const bar = div.selectAll("div");

    // Bind this selection to the data (computing enter, update and exit).
    const barUpdate = bar.data(data2);
    console.log(barUpdate)

    // Join the selection and the data, appending the entering bars.
    const barNew = barUpdate.join("div");
    //const barNew = barUpdate.enter().append("div");

    // Apply some styles to the bars.
    barNew.style("background", "LightCoral");
    barNew.style("padding", "3px");
    barNew.style("margin", "1px");

    // Set the width as a function of data.
    barNew.style("width", d => `${d/2}px`);

    // Set the text of each bar as the data.
    barNew.text(d => "ranking position: " + d.rank + ".  -  ." + "Port User: " + d.port_id);

    // Return the chart container.
    return div.node();
}

//main Function to create graph and add statistics of 5 top users.
function boardRank() {
    labels = ['<p><font size="4" color="black">Top 5 scorers in the quiz:</p>'];
    createLegend();
    createScoreGraph(userScoresQuizJson);
}

//-----------------------------------------------------

//Javascript to obtain graph showing daily participation rates for the past week
//(how many questions have been answered, and how many answers were correct) ONE USER (ADVANCE FUNCTIONALITY 2)
//loaded at the m0LoadMap.js file, in the loading map. To avoid delays.
var participationRate1Json;

function participationRate1() {
    var serviceUrl = "https://developer.cege.ucl.ac.uk:" + httpsPortNumberAPI + "/participationRate1/" + httpsPortNumberAPI;
    console.log("calling to obtain top 5 scorers in the quiz");
    $.ajax({
        url: serviceUrl,
        crossDomain: true,
        type: "GET",
        success: function(result) {
            participationRate1Json = result[0].array_to_json;
            console.log(participationRate1Json)
        },
    });
}

//Javascript to obtain graph showing daily participation rates for the past week
//(how many questions have been answered, and how many answers were correct) ALL USERS (ADVANCE FUNCTIONALITY 2)
//loaded at the m0LoadMap.js file, in the loading map. To avoid delays.
var participationRate2Json;

function participationRate2() {
    var serviceUrl = "https://developer.cege.ucl.ac.uk:" + httpsPortNumberAPI + "/participationRate2";
    console.log("calling to obtain top 5 scorers in the quiz");
    $.ajax({
        url: serviceUrl,
        crossDomain: true,
        type: "GET",
        success: function(result) {
            participationRate2Json = result[0].array_to_json;
            console.log(participationRate2Json)
        },
    });
}

//function to create the D3 graph to participationRate1
//code from https://medium.com/@vaibhavkumar_19430/how-to-create-a-grouped-bar-chart-in-d3-js-232c54f85894
function createParticipationRate1(data) {
  models = data;
  //var prop = "port_id";
//delete models[prop];
console.log(JSON.stringify(models));

    var container = d3.select(".info_legend")
        width = 520,
        height = 220,
        margin = {
            top: 30,
            right: 20,
            bottom: 30,
            left: 50
        },
        barPadding = .2,
        axisTicks = {
            qty: 5,
            outerSize: 0,
            dateFormat: '%m-%d'
        };
    var svg = container
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("fill", "white")
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    var xScale0 = d3.scaleBand().range([0, width - margin.left - margin.right]).padding(barPadding);
    var xScale1 = d3.scaleBand();
    var yScale = d3.scaleLinear().range([height - margin.top - margin.bottom, 0]);
    var xAxis = d3.axisBottom(xScale0).tickSizeOuter(axisTicks.outerSize);
    var yAxis = d3.axisLeft(yScale).ticks(axisTicks.qty).tickSizeOuter(axisTicks.outerSize);
    xScale0.domain(models.map(d => d.day));
    xScale1.domain(['questions_answered', 'questions_correct']).range([0, xScale0.bandwidth()]);
    yScale.domain([0, d3.max(models, d => d.questions_answered > d.questions_correct ? d.questions_answered : d.questions_correct)]);

    var day = svg.selectAll(".day")
        .data(models)
        .enter().append("g")
        .attr("class", "day")
        .attr("transform", d => `translate(${xScale0(d.day)},0)`);

    /* Add questions_answered bars */
    day.selectAll(".bar.questions_answered")
        .data(d => [d])
        .enter()
        .append("rect")
        .attr("class", "bar questions_answered")
        .style("fill", "blue")
        .attr("x", d => xScale1('questions_answered'))
        .attr("y", d => yScale(d.questions_answered))
        .attr("width", xScale1.bandwidth())
        .attr("height", d => {
            return height - margin.top - margin.bottom - yScale(d.questions_answered)
        });

    /* Add questions_correct bars */
    day.selectAll(".bar.questions_correct")
        .data(d => [d])
        .enter()
        .append("rect")
        .attr("class", "bar questions_correct")
        .style("fill", "red")
        .attr("x", d => xScale1('questions_correct'))
        .attr("y", d => yScale(d.questions_correct))
        .attr("width", xScale1.bandwidth())
        .attr("height", d => {
            return height - margin.top - margin.bottom - yScale(d.questions_correct)
        });

    // Add the X Axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(0,${height - margin.top - margin.bottom})`)
        .call(xAxis);
    // Add the Y Axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);
}

  //main Function to create graph and add the D3 graph to participationRate1 CURRENT USER.
function partRate1() {
    labels = ['<p><font size="4" color="black">Daily participation rate for Current User:</p>'+
  '<p><font size="4" color="blue">Answered Questions</p>'+
'<p><font size="4" color="red">Answered correctly</p>'];
    createLegend();
    createParticipationRate1(participationRate1Json);
}

//main Function to create graph and add the D3 graph to participationRate1 ALL USERs.
function partRate2() {
  labels = ['<p><font size="4" color="black">Daily participation rate for All User:</p>'+
'<p><font size="4" color="blue">Answered Questions</p>'+
'<p><font size="4" color="red">Answered correctly</p>'];
  createLegend();
  createParticipationRate1(participationRate2Json);
}
