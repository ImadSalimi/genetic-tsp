var tsp = require('./tsp');

var config = {
	iterations: 100000,
	size: 100,
	crossover: 0.9,
	mutation: 0.02,
	skip: 20
};
// Create 20 random cities
var userData = {
	randomCities: []
};
for (var i = 0; i < 6; i++) {
	userData.randomCities.push(new tsp.City.constructor());
}


tsp.userData = userData;
var a = tsp.seed();
var b = tsp.seed();
console.log(a, b);
var children = tsp.crossover(b, a);
console.log(children[0], children[1]);

// tsp.evolve(config, userData);