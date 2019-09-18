var users = [
	{
		id: 0,
		username: "tizio",
		password: "scamorza",
		// password not hashed, here for debug
		age: 28
	},
	{
		id: 1,
		username: "caio",
		password: "$2b$12$EH1fTMo/JngGsSR9nPSW6uCAK1qkoDyYeY.X28EXdq/0kOe72wrTy",
		// password not hashed: provolone
		age: 32
	},
	{	id: 2,
		username: "sempronio",
		password: "$2b$12$zF3ZRVTGijb39r/apWk5dOz9o31zJ1c.JGWBd1wVybjA075dg.KxO",
		// password not hashed: taleggio
		age: 12
	}

];


module.exports = {data:users};

module.exports.func_1 = function(){}