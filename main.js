const path = require('path');
const express = require('express');
const fs = require('fs');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = 8080;
const isDev = app.get('env') == 'development';

const rootpath = __dirname;
const assetspath = path.join(__dirname, 'assets');
const viewspath = path.join(__dirname, 'views');

const bcrypt = require('bcrypt');
const saltRound = 12;

// app path configuration (assets/views)
app.set('view engine', 'ejs');
app.set('views', viewspath);
app.use('/assets', express.static(assetspath));
app.use(cookieParser());

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
		password: "provolone",
		age: 32
	},
	{	id: 2,
		username: "sempronio",
		password: "$2b$12$zF3ZRVTGijb39r/apWk5dOz9o31zJ1c.JGWBd1wVybjA075dg.KxO",
		// password non hashata: taleggio
		age: 12
	}

];


// live-reload in development mode
if (isDev) {
	const reloader = require('easy-livereload');
	const config = { watchDirs: [__dirname], checkFunc: () => true };
	app.use(reloader(config));
}

// home path  
app.get('/', function (req, res) {
	let context = {};

	if (typeof req.cookies.current_user !== 'undefined'){
		let user_id = +req.cookies.current_user;
		if (!isNaN(user_id)){
			context.user = users[user_id];
		}
	}

  	res.render('index', context);
});

app.get('/hello', function(req, res){
	console.log("QUERY", req.query);
	// res.cookie("A", "B");
	res.contentType("text/plain");
	res.send("hello world");
});

app.get('/login', function (req, res) {
	console.log("GET /login");
	res.render('login', {});
});

app.post('/login', urlencodedParser, function(req, res){
	let context = {};

	context.auth = {
		username: req.body.username || null,
		password: req.body.password || null
	};

	let username = context.auth.username;
	let password = context.auth.username;

	console.log("POST /login", context);
	 // e necessario?

	if (username === null || 
		username.length < 4 || 
		username.length > 10 || 
		!(/^[a-zA-Z][a-zA-Z0-9]*$/.test(username)) ||
		false ) {
		context.error = "invalid username";
	} else if (password === null ||
		password.length < 8 ||
		password.length > 15) {
		context.error = "invalid password";
	};
	// check typeof username != undefined && username.length > 8
	for (let i = 0; i < users.length; i++){
		let currUser = users[i];
		/*bcrypt.compare(context.auth.password, currUser.password, function (err, result) {
			if (result == true &&
				currUser.username == context.auth.username) {
				res.cookie("current_user", i);
				res.redirect('/');
				return;
			} else {	
				context.error = "incorrect password or username";
			}
		});*/

		if (currUser.username == context.auth.username && 
			currUser.password == context.auth.password) { 	
			res.cookie("current_user", i);
			res.redirect('/');
			return;	
		} else
			context.error = "unknow username or password"
		

	}
	//});
	//context.error = "invalid username or password"

	res.render('login', context);
});

app.get('/signup', function(req, res){
	console.log("GET /signup")
	res.render('signup', {});
});



app.post('/signup', urlencodedParser, function(req, res){
	console.log("POST /signup");

	let context = {};

	context.auth = {
		username: req.body.username || null,
		password: req.body.password || null,
		age: +req.body.age
	}

	context.error = "";/* context error non mi funziona*/

	let username = context.auth.username;
	let password = context.auth.username;
	let age = context.auth.age;

	/*if (context.auth.age.length < 2 || context.auth.age.length > 3) {
		return res.status(400).send('Invalid age!');
	}
	
	for (let i = 0; i < users.length; i++){
		let currUser = users[i];
		if (currUser.username == context.auth.username)
			return res.status(409).send('This user is already exist');
		//if (currUser.age.length < 2 || currUser.age.length > 3) 
		//	return res.status(400).send('Invalid age!');
		}*/
	if (username === null || 
		username.length < 4 || 
		username.length > 10 || 
		!(/^[a-zA-Z][a-zA-Z0-9]*$/.test(username)) ||
		false /* se inizio con un numero entra in loop infinito*/) {
		//context.error = "invalid username";
		return res.status(409).send("invalid username")
	} else if (password === null ||
		password.length < 8 ||  //fa errore se username e <8
		password.length > 15) {
		//context.error = "invalid password";
		return res.status(409).send("invalid password")
	} else if (isNaN(age) || 
		age.length > 3) {
		//context.error = "invalid age"	
		return res.status(409).send("invalid age")
	} else {
		for (let i = 0; i < users.length; i++){
		let currUser = users[i];
			if (currUser.username == context.auth.username)
			return res.status(409).send('This user is already exist');
		};
	};	
	res.cookie("logged", "server-signed-key");

	bcrypt.hash(context.auth.password, saltRound, function(err, hash) {
	users.push( {id: users.length, 
				username: context.auth.username, 
				password: hash, 
				age: context.auth.age});
	});
	res.cookie("current_user", users.length-1)//sotto bcrypt non mi legge users.length bene
	res.redirect('/')
	console.log("POST /signup", context); //perche funziona senza queste righe?
	res.render('signup', context);
	
	// all cool
	// register user
	// set cookie LOGIN
	// redirect
	return;
});

app.get('/logout', function(req, res){
	res.clearCookie("current_user");
	res.redirect('/');
});


app.get('/users', function(req, res){
	res.send(users);
});

// server
app.listen(PORT, function () {
  console.log('Blog listening on port', PORT);
  console.log('AssetPath:', assetspath);
  console.log('Mode:', isDev ? "development" : "production");
});
