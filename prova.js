//const myModule = require('./database_di_prova');
//let users = myModule.databased();

const users = require('./database_di_prova.js');

console.log(users.databased());

//users.push( {id: users.length+1, username: "tizio", password:"caio", age:36});
console.log(users);