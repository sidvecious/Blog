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
		password: "$2b$12$EH1fTMo/JngGsSR9nPSW6uCAK1qkoDyYeY.X28EXdq/0kOe72wrTy",
		// password non hashata: provolone
		age: 32
	},
	{	id: 2,
		username: "sempronio",
		password: "$2b$12$zF3ZRVTGijb39r/apWk5dOz9o31zJ1c.JGWBd1wVybjA075dg.KxO",
		// password non hashata: taleggio
		age: 12
	}

];


/*
// MODELsempronio

let users = [
		new User(0, "tizio", "scamorza"),
		new User(1, "caio", "provolone")
];

let db = new Users(users);

let currUser = db.find_by({username: username});

currUser.valid() // ?
currUser.checkPassword(pass)

*/


module.exports = {data:users};

module.exports.func_1 = function(){}