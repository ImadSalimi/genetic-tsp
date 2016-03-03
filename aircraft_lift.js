var Genetic = require('genetic-js'),
	genetic = Genetic.create();

genetic.optimize = Genetic.Optimize.Maximize;
genetic.select1 = Genetic.Select1.Random;
genetic.select2 = Genetic.Select2.FittestRandom;

genetic.randomBinaryArray = function(bitLength) {
	var res = [];
	for (var i = 0; i < bitLength; i++)
		res.push(Math.floor(Math.random() * 2));

	return res;
}

genetic.seed = function() {
	var bitLength = this.userData['bitLength'] || 6;
	var entity = {
		A: [],
		B: [],
		C: [],
		D: []
	};

	for (var param in entity)
		entity[param] = this.randomBinaryArray(bitLength);

	return entity;
}

genetic.toDecimal = function(entity) {

	/**
	 * Returns the integer in decimal that is represented by an array of bits.
	 * @param  {array} bits An array of 0s and 1s (Ex.: [1, 0, 0, 1])
	 * @return {int}      The value in decimal of the binary array (Ex.: 9)
	 */
	function binToDec(bits) {
		return bits.reduce(function(res, bit, i) {
			var power = bits.length - i - 1;
			return res + Math.pow(2, power) * bit;
		}, 0);
	}

	var res = {};
	for (var param in entity)
		res[param] = binToDec(entity[param]);

	return res;
}

genetic.mutate = function(entity) {
	// Randomly change one of the parameters
	for (var param in entity) {
		if (Math.random() < 0.25) {
			entity[param] = this.randomBinaryArray(entity[param].length);
			break;
		}
	}

	return entity;
}

genetic.crossover = function(mother, father) {
	var son = {
		A: father.A,
		B: mother.B,
		C: father.C,
		D: mother.D
	};
	var daughter = {
		A: mother.A,
		B: father.B,
		C: mother.C,
		D: father.D
	}

	return [son, daughter];
}

genetic.calculateLift = function(entity) {
	return Math.pow(entity.A - entity.B, 2) + Math.pow(entity.C - entity.D, 2)
			- Math.pow(entity.A - 30, 3) - Math.pow(entity.C - 40, 3);
}

genetic.fitness = function(entity) {
	var fitness = 0;

	entity = this.toDecimal(entity);
	fitness += this.calculateLift(entity);

	return fitness;
}

genetic.generation = function(pop, generation, stats) {
	return true;
}

genetic.notification = function(pop, generation, stats, isFinished) {
	var best = this.toDecimal(pop[0].entity);
	best.Lift = pop[0].fitness;

	console.log("Generation", generation, "| Best entity:", best);
}

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

genetic.evolve(config, userData);