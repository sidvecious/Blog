

GET
/ -> home (login)

GET/POST
/login

GET
/logout

GET/POST
/signup

const path = require('path');
const express = require('express');
const fs = require('fs');

const app = express();
const PORT = 8080;
const isDev = app.get('env') == 'development';

const rootpath = __dirname;
const assetspath = path.join(__dirname, 'assets');
const viewspath = path.join(__dirname, 'views');

// app path configuration (assets/views)
app.set('view engine', 'ejs');
app.set('views', viewspath);
app.use('/assets', express.static(assetspath));

var bodyParser= require('body-parser');
// form-urlencoded
var urlencodedParser = bodyParser.urlencoded({ extended:false })


var users = [
	{
		id: 0,
		username: "tizio",
		password: "scamorza",
		age: 28
	},
	{
		id: 1,
		username: "caio",
		password: "provolone"
		age: 32
	},
	{
		id: 2,
		username: "sempronio",
		password: "taleggio"
		age: 36
	}

];


// live-reload in development mode
if (isDev) {
	const reloader = require('easy-livereload');
	const config = { watchDirs: [__dirname], checkFunc: () => true };
	app.use(reloader(config));
}

// home path  **** doesn't work *****
app.get('/', function (req, res) {
	// render
  	res.render('index', {});
});

app.get('/hello', function(req, res){
	console.log("QUERY", req.query);
	// res.cookie("A", "B");
	res.contentType("text/plain");
	res.send("hello world");
});

// POST Method, output in JSON
app.get('/login', function (req, res) {
	// response = {
	//	username:req.body.username,
	//	pw:req.body.pw
	//};
	//console.log("POST", response);
	//res.end(JSON.stringify(response));
	res.cookie("LOGGED", "yes");
	console.log("GET /login", req)
	res.render('login', {});
});

app.post('/login', urlencodedParser, function(req, res){
	let context = {};

	context.auth = {
		username: req.body.username,
		password: req.body.password
	};

	// check typeof username != undefined && username.length > 8
	
	for (let i = 0; i < users.length; i++){
		let currUser = users[i];
		if (currUser.username == context.auth.username && 
			currUser.password == context.auth.password) {
			res.cookie("logged", "server-signed-key");
			res.redirect('/');
			return;	
		}
	}

	context.error = "invalid username or password"

	console.log("POST /login", context);
	res.render('login', context);
});

app.get('/logout', function(req, res){
	// clear cookies
	res.redirect('/');
});


// server
app.listen(PORT, function () {
  console.log('Blog listening on port', PORT);
  console.log('AssetPath:', assetspath);
  console.log('Mode:', isDev ? "development" : "production");
});
