// Load the genetic-js extension
var Genetic = require('./lib/genetic-js-ext'),
	genetic = Genetic.create();

// Optimization method
genetic.optimize = Genetic.Optimize.Maximize;
// Selection methods
genetic.select1 = Genetic.Select1.Tournament5;
genetic.select2 = Genetic.Select2.Tournament5;

var config = {
	iterations: 100,
	size: 100,
	crossover: 0.6,
	mutation: 0.1,
	skip: 10
}

var userData = {
	bitLength: 6
}

// genetic.evolve(config, userData);