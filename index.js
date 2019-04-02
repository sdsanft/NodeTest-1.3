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

//Setting up our Mongo connection
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

//Creating our collection
MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		var dbo = db.db("mydb");

		dbo.createCollection("customers", function(err, res) {
			if (err) throw err;
			console.log("Collection created!");
			db.close();
		});
});

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
	res.render('user.ejs', {port:port, username:req.params.username})
})

app.listen(port, function(req, res) {
	console.log("Listening at port: " + port)
})