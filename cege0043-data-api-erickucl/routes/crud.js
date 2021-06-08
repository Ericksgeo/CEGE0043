var express = require('express');
var pg = require('pg');
var crud = require('express').Router();
var fs = require('fs');
var configtext = "" + fs.readFileSync("/home/studentuser/certs/postGISConnection.js");

// now convert the configruation file into the correct format -i.e. a name/value pair array
var configarray = configtext.split(",");
var config = {};
for (var i = 0; i < configarray.length; i++) {
    var split = configarray[i].split(':');
    config[split[0].trim()] = split[1].trim();
}
var pool = new pg.Pool(config);
console.log(config);


// CRUD POST to insert questions data
crud.post('/insertFormData', (req, res) => {
    console.dir(req.body);

    pool.connect(function(err, client, done) {
        if (err) {
            console.log("not able to get connection " + err);
            res.status(400).send(err);
        }
        // pull the geometry component together
        // well known text should look like: 'POINT(-71.064544 42.28787)'
        var param1 = req.body.longitude;
        var param2 = req.body.latitude;

        var param3 = req.body.question_title;
        var param4 = req.body.question_text;
        var param5 = req.body.answer_1;
        var param6 = req.body.answer_2;
        var param7 = req.body.answer_3;
        var param8 = req.body.answer_4;
        var param9 = req.body.port_id;
        var param10 = req.body.correct_answer;

        // no need for injection prevention for st_geomfromtext as if
        // the lat/lng values are not numbers it will not process them at all
        // impossible to run a statement such as st_geomfromtext('POINT(delete from public.formdata')
        var geometrystring = "st_geomfromtext('POINT(" + req.body.longitude + " " + req.body.latitude + ")',4326)";
        var querystring = "INSERT into public.quizquestions(question_title,question_text,answer_1,answer_2,answer_3,answer_4,port_id,correct_answer,location) values ";
        querystring += "($1,$2,$3,$4,$5,$6,$7,$8,";
        querystring += geometrystring + ")";
        console.log(querystring);

        // Query to insert data, 8 parsed params.
        client.query(querystring, [param3, param4, param5, param6, param7, param8, param9, param10], function(err, result) {
            done();
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
            res.status(200).send("Form Data " + req.body.question_title + " has been inserted");
        });
    });
});

// CRUD POST to insert answers data (note different DB)
crud.post('/insertAnsData', (req, res) => {
    console.dir(req.body);

    pool.connect(function(err, client, done) {
        if (err) {
            console.log("not able to get connection " + err);
            res.status(400).send(err);
        }
        // All parameters to insert into answersDB
        var param1 = req.body.port_id;
        var param2 = req.body.question_id;
        var param3 = req.body.answer_selected;
        var param4 = req.body.correct_answer;

        var querystring = "INSERT into public.quizanswers (port_id, question_id, answer_selected, correct_answer) values (";
        querystring += "$1,$2,$3,$4)";
        console.log(querystring);

        // Query to insert data, 4 parsed params.
        client.query(querystring, [param1, param2, param3, param4], function(err, result) {
            done();
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
            res.status(200).send("question " + req.body.id + " has been answered");
        });
    });
});

// CRUD POST to DELETE questions data
crud.post('/deleteFormData', (req, res) => {
    console.dir(req.body);
    pool.connect(function(err, client, done) {
        if (err) {
            console.log("not able to get connection " + err);
            res.status(400).send(err);
        }
        var param1 = req.body.port_id;
        var param2 = req.body.id;
        var querystring = "DELETE from public.quizquestions where id = $1 and port_id = $2";
        console.log(querystring);

        // Query to delete questions data, 2 parsed params.
        client.query(querystring, [param2, param1], function(err, result) {
            done();
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
            res.status(200).send("Form Data with ID " + param2 + " and port_id " + param1 + " has been deleted (if it existed in the database)");
        });
    });
});

// CRUD GET to obtain correct answers data (ADVANCE FUNCTIONALITY 1)
crud.get('/correctAnsRequest/:port_id', function(req, res) {
    pool.connect(function(err, client, done) {
        if (err) {
            console.log("not able to get connection " + err);
            res.status(400).send(err);
        }

        var port_id = req.params.port_id;
        var querystring = "select array_to_json (array_agg(c)) from (SELECT COUNT(*) AS num_correct_questions from public.quizanswers where (answer_selected = correct_answer) and port_id = $1) c";
        console.log(querystring);

        // now run the query, 1 param
        client.query(querystring, [port_id], function(err, result) {
            done();
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
            res.status(200).send(result.rows);
        });

    });
});

// CRUD GET to obtain RANKING from answers data (ADVANCE FUNCTIONALITY 1)
crud.get('/userRankingRequest/:port_id', function(req, res) {
    pool.connect(function(err, client, done) {
        if (err) {
            console.log("not able to get connection " + err);
            res.status(400).send(err);
        }

        var port_id = req.params.port_id;
        var querystring = "select array_to_json (array_agg(hh)) from (select c.rank from (SELECT b.port_id, rank()over (order by num_questions desc) as rank from (select COUNT(*) AS num_questions, port_id from public.quizanswers where answer_selected = correct_answer group by port_id) b) c where c.port_id = $1) hh";
        console.log(querystring);

        // now run the query, 1 param (again)
        client.query(querystring, [port_id], function(err, result) {
            done();
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
            res.status(200).send(result.rows);
        });

    });
});

// CRUD GET to obtain top 5 scorers in the quiz  (ADVANCE FUNCTIONALITY 2)
crud.get('/userScoresQuiz', function(req, res) {
    pool.connect(function(err, client, done) {
        if (err) {
            console.log("not able to get connection " + err);
            res.status(400).send(err);
        }

        var querystring = "select array_to_json (array_agg(c)) from (select rank() over (order by num_questions desc) as rank , port_id from (select COUNT(*) AS num_questions, port_id from public.quizanswers where answer_selected = correct_answer group by port_id) b limit 5) c";
        console.log(querystring);

        // now run the query, no param.
        client.query(querystring, function(err, result) {
            done();
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
            res.status(200).send(result.rows);
        });
    });
});

// CRUD GET to obtain graph showing daily participation rates for the past week
//(how many questions have been answered, and how many answers were correct) ONE USER (ADVANCE FUNCTIONALITY 2)
crud.get('/participationRate1/:port_id', function(req, res) {
    pool.connect(function(err, client, done) {
        if (err) {
            console.log("not able to get connection " + err);
            res.status(400).send(err);
        }
        var port_id = req.params.port_id;
        var querystring = "select array_to_json (array_agg(c)) from (select * from public.participation_rates where port_id = $1) c";
        console.log(querystring);

        // now run the query, no param.
        client.query(querystring, [port_id], function(err, result) {
            done();
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
            res.status(200).send(result.rows);
        });
    });
});

// CRUD GET to obtain graph showing daily participation rates for the past week
//(how many questions have been answered, and how many answers were correct) ALL USERS (ADVANCE FUNCTIONALITY 2)
crud.get('/participationRate2', function(req, res) {
    pool.connect(function(err, client, done) {
        if (err) {
            console.log("not able to get connection " + err);
            res.status(400).send(err);
        }

        var querystring = "select  array_to_json (array_agg(c)) from (select day, sum(questions_answered) as questions_answered, sum(questions_correct) as questions_correct from public.participation_rates group by day) c";
        console.log(querystring);

        // now run the query, no param.
        client.query(querystring, function(err, result) {
            done();
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
            res.status(200).send(result.rows);
        });
    });
});

//adding get CRUD for list of the 5 most difficult questions
crud.get('/hardestQuestions', function (req, res) {
	pool.connect(function (err, client, done) {
		if (err) {
			console.log("not able to get connection " + err);
			res.status(400).send(err);
		}
    var querystring = "select array_to_json (array_agg(d)) from (select c.* from public.quizquestions c inner join  (select count(*) as incorrectanswers, question_id from public.quizanswers where  answer_selected <> correct_answer group by question_id order by incorrectanswers desc limit 5) b on b.question_id = c.id) d; ";

		client.query(querystring, function (err, result) {
			done();
			if (err) {
				console.log(err);
				res.status(400).send(err);
			}
			res.status(200).send(result.rows);
		});
	});
});

module.exports = crud;
