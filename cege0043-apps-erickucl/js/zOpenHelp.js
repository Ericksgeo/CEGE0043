//javascript to load Help HTML
// HELP Section created using HELPNDOC sotware.
//Content Created by Myself, Help Functionality created through HelpNDOC.
//https://www.helpndoc.com/

  var openHelpURL;

function openHelp(e) {
    if (e == "helpquestionsc") {
        openHelpURL = "https://developer.cege.ucl.ac.uk:" + httpsPortNumberApp + "/help/helpquestionsc/Quiz2GoQC.html";
    } else {
        openHelpURL = "https://developer.cege.ucl.ac.uk:" + httpsPortNumberApp + "/help/helpquizc/Quiz2GoQuizC.html";
    }
}
