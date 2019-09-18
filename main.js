const path = require('path');
const express = require('express');
const fs = require('fs');
// use of cookieParser for hashing cookie values
const cookieParser = require('cookie-parser');

const app = express();
const PORT = 8080;
const isDev = app.get('env') == 'development';

const rootpath = __dirname;
const assetspath = path.join(__dirname, 'assets');
const viewspath = path.join(__dirname, 'views');

// use of bcrypt for hashing passwords
const bcrypt = require('bcrypt');
const saltRound = 12;

const database = require("./database.js")

// app path configuration (assets/views)
app.set('view engine', 'ejs');
app.set('views', viewspath);
app.use('/assets', express.static(assetspath));

app.use(cookieParser('truesecret')); 

var users = database["data"]

var bodyParser= require('body-parser');
// form-urlencoded
var urlencodedParser = bodyParser.urlencoded({ extended:false })

// verify login user
const login_user = (req, res, next) => {
	console.log("middleware: login_user");

	if (typeof req.signedCookies !== 'undefined'){
		const cookies = req.signedCookies;

		const current_user = cookies.current_user;

		if (typeof current_user !== 'undefined'){
			let user_id = +current_user;
			if (!isNaN(user_id)){
				req.user = users[user_id];
			}
		}
	}

	next();
};

app.use(login_user);

// home path  
app.get('/', function (req, res) {
	let context = {};

	if (typeof req.user !== 'undefined'){ //link id  to a req.user
		context.user = req.user;
	}

  	res.render('index', context);
});

// debug function
app.get('/debug', function(req, res){
	let response;

	if (typeof req.user !== 'undefined'){
		response = {status: 200, response: req.user};
	} else {
		response = {status: 404, error: "user not found"};
	}
	res.json(response);
});

app.get('/login', function (req, res) {
	console.log("GET /login");
	res.render('login', {});
});

// function of login
app.post('/login', urlencodedParser, function(req, res){
	let context = {};

	context.auth = {
		username: req.body.username || null,
		password: req.body.password || null
	};

	let username = context.auth.username;
	let password = context.auth.password;

	console.log("POST /login", context);

	//error management of the login form
	if (username === null || 
		username.length < 4 || 
		username.length > 10 || 
		!(/^[a-zA-Z][a-zA-Z0-9]*$/.test(username)) ||
		false ) {

		context.error = "invalid username";
		return res.render('login', context);
	} else if (password === null ||
		password.length < 8 ||
		password.length > 15) {

		context.error = "invalid password";
		return res.render('login', context);
	};
	
	let currUser = null;
	for (let i = 0; i < users.length; i++){
		if (users[i].username === context.auth.username) {
			currUser = users[i];
			break;
		}
	}

	// does authentication
	if (currUser !== null) {
		bcrypt.compare(context.auth.password, currUser.password, function (err, result) {
			if (result == true &&
				currUser.username == context.auth.username) {
				let options = { 
					maxAge: 1000* 60 * 15, //set the life of cookies 15 minutes
					httpOnly: true,
					signed: true
				};

				res.cookie("current_user", currUser.id, options); 
				res.redirect('/');
			} else {	
				context.error = "incorrect password or username";
				res.render('login', context);
			}
		});
	} else {
		context.error = 'unknown username or password';
		res.render('login', context);
	};
}); 

app.get('/signup', function(req, res){
	console.log("GET /signup")
	res.render('signup', {});
});

// function of sign up
app.post('/signup', urlencodedParser, function(req, res){
	console.log("POST /signup");

	let context = {};

	context.auth = {
		username: req.body.username || null,
		password: req.body.password || null,
		age: +req.body.age
	}

	let username = context.auth.username;
	let password = context.auth.password;
	let age = context.auth.age;
	console.log(age);

	// error management of the sign up form
	if (username === null || 
		username.length < 4 || 
		username.length > 10 || 
		!(/^[a-zA-Z][a-zA-Z0-9]*$/.test(username)) ||
		false ) {
		
		context.error = "invalid username";
		return res.render('signup', context);
	} else if (password === null ||
		password.length < 8 ||  
		password.length > 15) {
		
		context.error = "invalid password";
		return res.render('signup', context);
	} else if (isNaN(age) || 
		age > 120) {
		
		context.error = "invalid age";
		return res.render('signup', context);
	} else {
		for (let i = 0; i < users.length; i++){
			let currUser = users[i];
			if (currUser.username == context.auth.username ) {
				context.error = 'This user already exist';
				return res.render('signup', context);
			}	
		}
	}

	// writes user's information to the database , the password is encrypted
	bcrypt.hash(context.auth.password, saltRound, function(err, hash) {
		const user = {
			id: users.length, 
			username: context.auth.username, 
			password: hash, 
			age: context.auth.age
		};
		users.push(user);
		res.redirect('/');
	});
});

app.get('/logout', function(req, res){
	console.log("GET /logout")
	res.clearCookie("current_user");
	res.redirect('/');
});

// a view of my database
app.get('/users', function(req, res){
	console.log("GET /users")
	res.send(users);
});

// server
app.listen(PORT, function () {
  console.log('Blog listening on port', PORT);
  console.log('AssetPath:', assetspath);
  // split beetwen development and production mode 
  // npm run dev or npm run prod
  console.log('Mode:', isDev ? "development" : "production");
});
