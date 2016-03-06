// Load the genetic-js extension
var Genetic = require('./lib/genetic-js-ext'),
	genetic = Genetic.create();
// Entities
var City = require('./lib/City');

// Optimization method
genetic.optimize = Genetic.Optimize.Minimize;
// Selection methods
genetic.select1 = Genetic.Select1.Tournament3;
genetic.select2 = Genetic.Select2.FittestRandom;

// Create a route from a defined number of random cities
genetic.City = City.prototype;
genetic.shuffleArray = function(a) {
	var j, x, i;
	for (i = a.length; i; i -= 1) {
		j = Math.floor(Math.random() * i);
		x = a[i - 1];
		a[i - 1] = a[j];
		a[j] = x;
	}
	return a;
};
genetic.seed = function() {
	return this.shuffleArray(this.userData['randomCities']);
};

// Swap two cities positions in the route
genetic.mutate = function(route) {
	// Select two random cities
	var ca = Math.floor(Math.random() * route.length);
	var cb = Math.floor(Math.random() * route.length);
	// Swap their positions
	var t = route[ca];
	route[ca] = route[cb];
	route[cb] = t;

	return route;
}

// Ordered crossover
genetic.crossover = function(mother, father) {

	function ox(route1, route2, ca, cb) {
		// Remove the cities we're gonna take from the first route so they don't appear in the offspring
		var filtered = route2.filter(function(city) {
			var found = false;
			for (var i = ca; i <= cb; i++) {
				var c = route1[i];
				if (c.x == city.x && c.y == city.y)
					found = true;
			}
			return !found;
		});

		// Create the offspring
		var offspring = [];
		for (var i = 0; i < route1.length; i++) {
			if (ca <= i && i <= cb) {
				offspring.push(route1[i]);
			} else {
				var r = Math.floor(Math.random() * filtered.length);
				offspring.push(filtered[r]);
				filtered.splice(r, 1);
			}
		}

		return offspring;
	}

	// Determine the crossover subset
	var ca = Math.floor(Math.random() * mother.length);
	var cb;
	do {
		cb = Math.floor(Math.random() * mother.length);
		if (ca > cb) {
			var t = ca; ca = cb; cb = t;
		}
	} while (cb == ca);

	var son = ox(father, mother, ca, cb);
	var daughter = ox(mother, father, ca, cb);

	return [son, daughter];
}

/**
 * Calculates the fitness as the total distance of the route
 * @param  {array} entity The route we're evaluating
 * @return {double}        The fitness score
 */
genetic.fitness = function(entity) {
	var self = this;
	var fitness = entity.reduce(function(distance, city, i) {
		if (i == entity.length - 1) {
			return distance + self.City.distanceTo.call(city, entity[0]);
		} else {
			return distance + self.City.distanceTo.call(city, entity[i+1]);
		}
	}, 0.0);

	return fitness;
}

genetic.generation = function(pop, generation, stats) {
	return true;
}

genetic.notification = function(pop, gen, stats, isFinished) {
	console.log("Generation "+gen);
	console.log("Distance of best route: "+pop[0].fitness)
}

// Export for node and the browser
if (typeof module != 'undefined') {
	module.exports = genetic;
}
if (typeof window != 'undefined') {
	window.tsp = genetic;
}