
/**
 * Extending genetic-js
 *
 * Imad Salimi
 */

var Genetic = require('genetic-js');

Genetic.Select2.Tournament5 = function(pop) {
	function tournament5(pop) {
		var n = pop.length;
		var a = pop[Math.floor(Math.random() * n)];
		var b = pop[Math.floor(Math.random() * n)];
		var c = pop[Math.floor(Math.random() * n)];
		var d = pop[Math.floor(Math.random() * n)];
		var e = pop[Math.floor(Math.random() * n)];
		var best = this.optimize(a.fitness, b.fitness) ? a : b;
		best = this.optimize(best.fitness, c.fitness) ? best : c;
		best = this.optimize(best.fitness, d.fitness) ? best : d;
		best = this.optimize(best.fitness, e.fitness) ? best : e;
		return best.entity;
	};

	return [tournament5.call(this, pop), tournament5.call(this, pop)];
}

Genetic.Select2.RouletteWheel = function(pop) {
	function wheelOut(r) {
		// Loop through the population and sum fitnesses
		var index, sum = 0;
		for (var i = 0; i < pop.length; i++) {
			sum += pop[i].fitness;
			if (sum >= r) {
				index = i;
				break;
			}
		}
		return index;
	}

	// Calculate the sum of the fitnesses
	var F = pop.reduce(function(sum, route) { return sum + route.fitness; }, 0);

	var route1 = pop[wheelOut(Math.random() * F)].entity;
	var route2 = pop[wheelOut(Math.random() * F)].entity;

	return [route1, route2];
}

// Export for node and the browser
if (typeof module != 'undefined') {
	module.exports = Genetic;
}
if (typeof window != 'undefined') {
	window.Genetic = Genetic;
}