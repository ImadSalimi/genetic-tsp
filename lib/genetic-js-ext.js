
/**
 * Extending genetic-js
 *
 * Imad Salimi
 */

var Genetic = require('genetic-js');

// Add a Tournament5 Selection method
tournament5 = function(pop) {
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

Genetic.Select1.Tournament5 = tournament5;

Genetic.Select2.Tournament5 = function(pop) {
	return [tournament5.call(this, pop), tournament5.call(this, pop)];
}

module.exports = Genetic;