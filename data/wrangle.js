/**
 * Prepares and formats the csv airports data, then stores it in MongoDB
 *
 * Imad Salimi
 */

// Dependencies
var assert = require('assert'),
	csv = require('csv'),
	fs = require('fs')
	MongoClient = require('mongodb').MongoClient,
	url = 'mongodb://localhost:27017/tsp';

// Read the csv file into a string
var csvString = fs.readFileSync('./airports.dat', 'utf-8');

var metadata = csv.parse(csvString, {columns: true}, function(err, data) {
	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		console.log("Connected to database succesfully!");
		var airports = db.collection('airports');
		airports.insert(data, function(err, docs) {
			if (!err)
				console.log("Inserted "+data.length+" documents!")
			else
				console.error(err)
			db.close()
		});
	});
});
