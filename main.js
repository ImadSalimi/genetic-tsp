var tsp = require('./tsp');

var config = {
	iterations: 100000,
	size: 100,
	crossover: 0,
	mutation: 1,
	skip: 20
};
// Create 20 random cities
var userData = {
	randomCities: []
};
for (var i = 0; i < 100; i++) {
	userData.randomCities.push(new tsp.City.constructor());
}

tsp.evolve(config, userData);