// Load the genetic-js extension
var Genetic = require('./lib/genetic-js-ext'),
	genetic = Genetic.create();
// Entities
var City = require('./lib/City');
// Helpers
var deepEqual = require('./lib/deepequal');

// Optimization method
genetic.optimize = Genetic.Optimize.Maximize;
// Selection methods
genetic.select1 = Genetic.Select1.Tournament3;
genetic.select2 = Genetic.Select2.RouletteWheel;

// Add some properties to the genetic object
genetic.City = City.prototype;
genetic.clone = Genetic.Clone;
genetic.deepEqual = deepEqual;

genetic.makeDistanceMatrix = function(cities) {
	var mat = [],
		n = cities.length;
	for (var i = 0; i < n; i++) {
		mat[i] = new Array(n);
		for (var j = 0; j < n; j++) {
			if (i == j) {
				mat[i][j] = 0;
			} else {
				if (!mat[i][j]) {
					mat[i][j] = this.City.distanceTo.call(cities[i], cities[j]);
					mat[j] = mat[j] || new Array(n);
					mat[j][i] = mat[i][j];
				}
			}
		}
	}
	return mat;
}
/**
 * Shuffles an array
 * @param  {array} a : The array to be shuffled
 * @return {array}   A shuffled copy of the array
 */
genetic.shuffleArray = function(a) {
	var result = [];
    while(a.length) {
        var index = Math.floor(a.length * Math.random());
        result.push(a[index]);
        a.splice(index, 1);
    }
    return result;
};
/**
 * Seeds a random route from the defined cities
 * @return {array} A permutation of cities that represents the route
 */
genetic.seed = function() {
	// The distances matrix
	this.distances = this.distances ||
				this.makeDistanceMatrix(this.userData['randomCities']);
	// An array containing the indexes of the cities
	this.cityIx = this.cityIx ||
				this.userData['randomCities'].map(function(_, i) { return i; });
	// Create a route by shuffling the indexes array
	var route = this.shuffleArray(this.clone(this.cityIx));
	return route;
};

/**
 * Performs a series of 2-opt swaps that seeks a better solution
 * @param  {array} route The route we're mutating
 * @return {array}       A (hopefully) shorter route
 */
genetic.mutate = function(route) {
	var self = this;
	function swapCities(route, i, j) {
		var res = self.clone(route);
		var t = res[i];
		res[i] = res[j];
		res[j] = t;

		return res;
	}

	function twoOptSwap(route, x, y) {
		var newRoute = [];
		for (var i = 0; i <= x-1; i++) newRoute.push(route[i]);
		for (var i = y; i >= x; i--) newRoute.push(route[i]);
		for (var i = y+1; i < route.length; i++) newRoute.push(route[i]);

		return newRoute;
	}

	// Store a better route if it was found
	var best = route;
	for (var i = 0; i < route.length-1; i++) {
		for (var j = i+1; j < route.length; j++) {
			var t = twoOptSwap(route, i, j);
			if (this.fitness(t) > this.fitness(route)) {
				best = t;
			}
		}
	}

	return best;
}

// Ordered crossover
genetic.crossover = function(mother, father) {

	function ox(route1, route2, ca, cb) {
		// Remove the cities we're gonna take from the first route so they don't appear in the offspring
		var filtered = route2.filter(function(city) {
			var found = false;
			for (var i = ca; i <= cb; i++) {
				if (route1[i] == city) {
					found = true;
					break;
				}
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
	var ca = Math.floor(Math.random() * (mother.length-1));
	var cb;
	do {
		cb = Math.floor(Math.random() * mother.length);
	} while (cb <= ca);

	var son = ox(father, mother, ca, cb);
	var daughter = ox(mother, father, ca, cb);

	return [son, daughter];
}

/**
 * Calculates the fitness as the inverse of the total distance of the route
 * @param  {array} route : The route we're evaluating
 * @return {double}        The fitness score
 */
genetic.fitness = function(route) {
	var self = this;
	var distance = route.reduce(function(distance, city, i) {
		if (i == route.length - 1) {
			return distance + self.distances[city][route[0]];
		} else {
			return distance + self.distances[city][route[i+1]];
		}
	}, 0.0);

	return 1 / distance;
}

genetic.generation = function(pop, generation, stats) {
	return true;
}

genetic.notification = function(pop, gen, stats, isFinished) {
	console.log("Generation "+gen);
	console.log("Distance of best route: "+1/pop[0].fitness)
}

// Export for node and the browser
if (typeof module != 'undefined') {
	module.exports = genetic;
}
if (typeof window != 'undefined') {
	window.tsp = genetic;
}