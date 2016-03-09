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
for (var i = 0; i < 10; i++) {
	userData.randomCities.push(new tsp.City.constructor());
}


tsp.userData = userData;
console.log(tsp.userData)
var a = tsp.seed();
var b = tsp.seed();
console.log(a, tsp.fitness(a))
// var c = tsp.crossover(b, a);
// console.log(c[0], c[1]);
var d = tsp.mutate(a);
console.log(d, tsp.fitness(d));

// tsp.evolve(config, userData);