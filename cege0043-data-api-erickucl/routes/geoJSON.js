var express = require('express');
var pg = require('pg');
var geoJSON = require('express').Router();
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

//adding get geoJSON for quiz questions passing port_id parameter
geoJSON.get('/getGeoJSON2/:tablename/:geomcolumn/:portNumber', function(req, res) {
    pool.connect(function(err, client, done) {
        if (err) {
            console.log("not able to get connection " + err);
            res.status(400).send(err);
        }

        var colnames = "";

        // first get a list of the columns that are in the table
        // use string_agg to generate a comma separated list that can then be pasted into the next query
        var tablename = req.params.tablename;
        var geomcolumn = req.params.geomcolumn;
        var geomcolumn = req.params.portNumber;
        var querystring = "select string_agg(colname,',') from ( select column_name as colname ";
        querystring = querystring + " FROM information_schema.columns as colname ";
        querystring = querystring + " where table_name   =$1";
        querystring = querystring + " and column_name <> $2 and data_type <> 'USER-DEFINED') as cols ";

        console.log(querystring);

        // now run the query
        client.query(querystring, [tablename, geomcolumn], function(err, result) {
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
            thecolnames = result.rows[0].string_agg;
            colnames = thecolnames;
            console.log("the colnames " + thecolnames);

            // now use the inbuilt geoJSON functionality
            // and create the required geoJSON format using a query adapted from here:
            // http://www.postgresonline.com/journal/archives/267-Creating-GeoJSON-Feature-Collections-with-JSON-and-PostGIS-functions.html, accessed 4th January 2018
            // note that query needs to be a single string with no line breaks so built it up bit by bit

            var querystring = " SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features  FROM ";
            querystring = querystring + "(SELECT 'Feature' As type     , ST_AsGeoJSON(lg." + req.params.geomcolumn + ")::json As geometry, ";
            querystring = querystring + "row_to_json((SELECT l FROM (SELECT " + colnames + ") As l      )) As properties";

            // depending on whether we have a port number, do differen things
            if (req.params.portNumber) {
                querystring = querystring + "   FROM " + req.params.tablename + "  As lg where lg.port_id = '" + req.params.portNumber + "' limit 10000  ) As f ";
            } else {
                querystring = querystring + "   FROM " + req.params.tablename + "  As lg limit 10000  ) As f ";
            }
            console.log(querystring);

            // run the second query
            client.query(querystring, function(err, result) {
                //call `done()` to release the client back to the pool
                done();
                if (err) {
                    console.log(err);
                    res.status(400).send(err);
                }
                res.status(200).send(result.rows);
            });

        });
    });
});


//adding get geoJSON for questions added last week from all users
geoJSON.get('/questionsLastWeek', function (req, res) {
	pool.connect(function (err, client, done) {
		if (err) {
			console.log("not able to get connection " + err);
			res.status(400).send(err);
		}
    var querystring = "SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features  FROM (SELECT 'Feature' As type     , ST_AsGeoJSON(lg.location)::json As geometry, row_to_json((SELECT l FROM (SELECT id, question_title, question_text, answer_1, answer_2, answer_3, answer_4, port_id, correct_answer) As l  )) As properties FROM public.quizquestions  As lg where timestamp > NOW()::DATE-EXTRACT(DOW FROM NOW())::INTEGER-7  limit 100  ) As f";

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

//adding get geoJSON showing the 5 questions closest to the user’s current location
geoJSON.get('/closestQuestions/:xxx/:yyy', function (req, res) {
	pool.connect(function (err, client, done) {
		if (err) {
			console.log("not able to get connection " + err);
			res.status(400).send(err);
		}

    var xxx = req.params.xxx;
    var yyy = req.params.yyy;

    var querystring = "SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features  FROM  (SELECT 'Feature' As type     , ST_AsGeoJSON(lg.location)::json As geometry,  row_to_json((SELECT l FROM (SELECT id, question_title, question_text, answer_1, answer_2, answer_3, answer_4, port_id, correct_answer) As l   )) As properties  FROM   (select c.* from public.quizquestions c inner join (select id, st_distance(a.location, st_geomfromtext('POINT("+yyy+" "+xxx+")',4326)) as distance from public.quizquestions a order by distance asc limit 5) b on c.id = b.id ) as lg) As f ";

    console.log(querystring);
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

//adding get geoJSON showing last 5 questions that the user answered
geoJSON.get('/lastQuestions/:port_id', function(req, res) {
    pool.connect(function(err, client, done) {
        if (err) {
            console.log("not able to get connection " + err);
            res.status(400).send(err);
        }
        var port_id = req.params.port_id;
        var querystring = "SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features  FROM  (SELECT 'Feature' As type     , ST_AsGeoJSON(lg.location)::json As geometry,  row_to_json((SELECT l FROM (SELECT id, question_title, question_text, answer_1, answer_2, answer_3, answer_4, port_id, correct_answer, answer_correct) As l   )) As properties  FROM  (select a.*, b.answer_correct from public.quizquestions a inner join  (select question_id, answer_selected=correct_answer as answer_correct from public.quizanswers where port_id = $1 order by timestamp desc limit 5) b on a.id = b.question_id) as lg) As f ";
        console.log(querystring);

        // now run the query, 1 param.
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

//adding get geoJSON that only shows questions and calculates proximity alerts for questions that the user hasn’t answered correctly
geoJSON.get('/notCompletedQuestions/:port_id', function(req, res) {
    pool.connect(function(err, client, done) {
        if (err) {
            console.log("not able to get connection " + err);
            res.status(400).send(err);
        }
        var port_id = req.params.port_id;
        var port_id2 = req.params.port_id;
        var querystring = "SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features  FROM  (SELECT 'Feature' As type     , ST_AsGeoJSON(lg.location)::json As geometry, row_to_json((SELECT l FROM (SELECT id, question_title, question_text, answer_1, answer_2, answer_3, answer_4, port_id, correct_answer) As l  )) As properties FROM (select * from public.quizquestions where id in (select question_id from public.quizanswers where port_id = $1 and answer_selected <> correct_answer union all select id from public.quizquestions where id not in (select question_id from public.quizanswers) and port_id = $2) ) as lg) As f ";
        console.log(querystring);

        // now run the query, 2 param.
        client.query(querystring, [port_id, port_id2], function(err, result) {
            done();
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
            res.status(200).send(result.rows);
        });
    });
});

module.exports = geoJSON;
