var Genetic = require('genetic-js'),
	genetic = Genetic.create();

genetic.optimize = Genetic.Optimize.Minimize;
genetic.select1 = Genetic.Select1.Tournament3;
genetic.select2 = Genetic.Select2.Tournament2;

genetic.seed = function() {
	var entity = [];

	for (var i = 0; i < this.userData['cards']; i++)
		entity.push(Math.floor(Math.random() * 2));

	// Mutate if we got an empty pile
	if (this.invalidConfiguration(entity))
		entity = this.mutate(entity);

	return entity;
};

genetic.calculate = function(entity) {
	var sum = entity.reduce(function(x, y, i) {
		if (y == 0) return x + (i + 1);
		else return x;
	}, 0);
	var product = entity.reduce(function(x, y, i) {
		if (y == 1) return x * (i + 1);
		else return x;
	}, 1);
	return {sum: sum, product: product};
}

genetic.winCondition = function(entity) {
	var _ = this.calculate(entity);
	return Math.abs(_.sum - this.userData['sum']) < 2 &&
			Math.abs(_.product - this.userData['product']) < 2;
}

genetic.invalidConfiguration = function(entity) {
	var _ = this.calculate(entity);
	return _.sum == 0 || _.product == 1;
}

genetic.mutate = function(entity) {
	var i = Math.floor(Math.random() * entity.length);
	// Move a random card to the other pile
	entity[i] = entity[i] ? 0 : 1;

	return entity;
};

genetic.crossover = function(mother, father) {

	function xor(a, b) {
		return (a || b) && !(a && b);
	}

	function xnor(a, b) {
		return (a && b) || !(a || b);
	}

	var son = [];
	var daughter = [];
	for (var i = 0; i < mother.length; i++) {
		son.push(Number(xor(mother[i], father[i])));
		daughter.push(Number(xnor(mother[i], father[i])));
	}

	if (this.invalidConfiguration(son)) son = this.mutate(son);
	if (this.invalidConfiguration(daughter)) daughter = this.mutate(daughter);
	
	return [son, daughter];
};

genetic.fitness = function(entity) {
	var fitness = 0;
	var factor = 100;

	var _ = this.calculate(entity);	
	var fitness1 = Math.abs(this.userData['sum'] - _.sum) * factor;
	var fitness2 = Math.abs(this.userData['product'] - _.product) * factor;

	fitness = fitness1 + fitness2;
	return fitness;
};

genetic.generation = function(pop, generation, stats) {
	return !this.winCondition(pop[0].entity);
};

genetic.print = function(entity) {
	var sumPile = entity.map(function(bit, i) {
		if (bit == 0) return i + 1;
		else return -1;
	}).filter(function(bit) {
		return bit != -1;
	});

	var productPile = entity.map(function(bit, i) {
		if (bit == 1) return i + 1;
		else return -1;
	}).filter(function(bit) {
		return bit != -1;
	});

	var _ = genetic.calculate(entity);
	console.log("[" + sumPile + "] Sum = " + _.sum + " | [" + productPile + "] = " + _.product);
};

genetic.notification = function(pop, generation, stats, isFinished) {
	console.log("Generation", generation, "| Error:", pop[0].fitness);
	this.print(pop[0].entity);
};

var config = {
	iterations: 2000,
	size: 250,
	crossover: 0.8,
	mutation: 0.1,
	skip: 100
}

var userData = {
	cards: 20,
	sum: 85+16+17+18,
	product: 4550*19*20
}

// Evolve
genetic.evolve(config, userData);
