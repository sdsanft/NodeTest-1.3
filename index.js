//Setting up our dependencies
const express = require('express')
const ejs = require('ejs')
const bodyParser = require('body-parser')
const mongo = require('mongodb')
const port = 1234

//Initiating express
const app = express()

//Setting ejs as our default
app.set('view engine', 'ejs')

//Setting up our bodyParser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

const MongoClient = require('mongodb').MongoClient;
//const assert = require('assert');
const url = "mongodb+srv://Origin:iN9JjqD6P2kJYiyf@cluster0-s8lva.gcp.mongodb.net/test?retryWrites=true"
//const url = "mongodb+srv://Origin:iN9JjqD6P2kJYiyf@clustertest-s8lva.mongodb.net/test?retryWrites=true";

app.get('/', function(req, res) {
	res.render('main.ejs', {port:port})
})

app.get('/signin', function(req, res) {
	res.render('signIn.ejs', {port:port})
})

app.post('/signin', function(req, res) {
	response = {username : req.body.username}

	console.log(response.username + " signed in")
	res.redirect('http://localhost:' + port + '/user/' + req.body.username)
})

app.get('/user/:username', function(req, res) {
	var settings;
	MongoClient.connect(url, {useNewUrlParser: true}, function(err, client) {
		if(err) throw err;
		db = client.db("MongoTest")
		settings = db.collection("UserSettings").findOne({_id: req.params.username}, function(err, result) {
			if (err) throw err;

			if(result == null) {
				settings = {_id: req.params.username, meetingTitle: "Meet and Greet", meetingLink: "", timezone: "MDT", days: ["Mon", "Tue", "Wed", "Thu", "Fri"]}
				db.collection("UserSettings").insertOne(settings)
			} else {
				settings = result
			}

			res.render('user.ejs', {port, settings})
		})
	})
})

app.get('/user/:username/settings', function(req, res) {
	res.render('userSettings.ejs', {port:port, username:req.params.username})
})

app.post('/user/:username/settings', function(req, res) {
	meetingTitle = req.body.meetingTitle
	meetingLink = req.body.meetingLink
	timezone = req.body.timezone

	MongoClient.connect(url, {useNewUrlParser: true}, function(err, client) {
		db = client.db("MongoTest")

		settings = db.collection("UserSettings").findOne({_id: req.params.username}, function(err, result) {
			if (err) throw err;

			if(result == null) {
				settings = {_id: req.params.username, meetingTitle, meetingLink, timezone, days:["Mon", "Tue", "Wed", "Thur", "Fri"]}
				db.collection("UserSettings").insertOne(settings, function() {
					res.redirect('http://localhost:' + port + '/user/' + req.params.username)
				})
			} else {
				var settings = {$set: {meetingTitle, meetingLink, timezone}}
				db.collection("UserSettings").updateOne({_id: req.params.username}, settings, function(err, result) {
					res.redirect('http://localhost:' + port + '/user/' + req.params.username)
				})
			}
		})
		
	})
})

app.listen(port, function(req, res) {
	console.log("Listening at port: " + port)
})