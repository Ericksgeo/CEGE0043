var hardestQuestionsJson;

//javascript to obtain json list with hardest questions
function hardestQuestions() {
    var serviceUrl = "https://developer.cege.ucl.ac.uk:" + httpsPortNumberAPI + "/hardestQuestions";
    console.log("calling to obtain top 5 scorers in the quiz");
    $.ajax({
        url: serviceUrl,
        crossDomain: true,
        type: "GET",
        success: function(result) {
            //getting the json information without main envelop
            hardestQuestionsJson = result[0].array_to_json;
            console.log(hardestQuestionsJson)
        },
    });
}

//create graph for hardest questions
//start creating the D3 graph from D3.js
function hardestQuestionsGraph(data) {
    console.log("The hardest questions in all quizzes are: |" + data);
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
    barNew.text(d => d.question_text);

    // Return the chart container.
    return div.node();
}

//main Function to create graph and add statistics of 5 top users.
function hardestQuestionsList() {
    labels = ['<p><font size="4" color="black">Top 5 Hardest questions in all quizzes:</p>'];
    createLegend();
    hardestQuestionsGraph(hardestQuestionsJson);
}
