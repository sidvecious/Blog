

class App {
	constructor(){
		this.cbs = [];
	}

	use(func){
		this.cbs.push(func);
	}

	run(element){
		let result = {};
		for(let i = 0; i < this.cbs.length; i++){
			this.cbs[i](element, result);
		}
		console.log(result);
	}
}

let app = new App;

app.use(function(req, res){
	console.log("callback 1:", req);
	res.cb_1 = true;
})

app.use(function(req, res){
	console.log("callback 2:", req);
	res.cb_2 = true;
})



async function after(i){
	await new Promise(resolve => setTimeout(resolve, i));
	return i;
}

(async () => {
	let val = await after(1000);
	console.log(val);
})();