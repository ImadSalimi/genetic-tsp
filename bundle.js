(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

/**
 * Constructor for the City class
 * @param  {int} x The x position of the city
 * @param  {int} y The y position of the city
 * @return {City}   An instance of the class
 */
function City(x, y) {
	var maxCoord = 300;
	// If x and y were provided
	if (x !== undefined && y !== undefined) {
		this.x = x;
		this.y = y;
	} else {
		// Generate x and y randomly
		this.x = Math.floor(Math.random() * maxCoord);
		this.y = Math.floor(Math.random() * maxCoord);
	}
}
City.prototype.constructor = City;
/**
 * Returns the distance between this city and a city of destination
 * @param  {City} city The destination city
 * @return {double}      The calculated distance
 */
City.prototype.distanceTo = function (city) {
	var dx = Math.abs(this.x - city.x);
	var dy = Math.abs(this.y - city.y);
	var distance = Math.sqrt(dx*dx + dy*dy);

	return distance;
}
/**
 * String reprentation
 * @return {string} A string representation of the city
 */
City.prototype.toString = function () {
	return '('+this.x+', '+this.y+')';
}

module.exports = City;

},{}],2:[function(require,module,exports){

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

// Export for node and the browser
if (typeof module != 'undefined') {
	module.exports = Genetic;
}
if (typeof window != 'undefined') {
	window.Genetic = Genetic;
}
},{"genetic-js":3}],3:[function(require,module,exports){

var Genetic = Genetic || (function(){
	
	'use strict';
	
	// facilitates communcation between web workers
	var Serialization = {
		"stringify": function (obj) {
			return JSON.stringify(obj, function (key, value) {
				if (value instanceof Function || typeof value == "function") return "__func__:" + value.toString();
				if (value instanceof RegExp) return "__regex__:" + value;
				return value;
			});
		}, "parse": function (str) {
			return JSON.parse(str, function (key, value) {
				if (typeof value != "string") return value;
				if (value.lastIndexOf("__func__:", 0) === 0) return eval('(' + value.slice(9) + ')');
				if (value.lastIndexOf("__regex__:", 0) === 0) return eval('(' + value.slice(10) + ')');
				return value;
			});
		}
	};
	
	var Clone = function(obj) {
		if (obj == null || typeof obj != "object")
			return obj;
		
		return JSON.parse(JSON.stringify(obj));
	};
	
	var Optimize = {
		"Maximize": function (a, b) { return a >= b; }
		, "Minimize": function (a, b) { return a < b; }
	};
	
	var Select1 = {
		"Tournament2": function(pop) {
			var n = pop.length;
			var a = pop[Math.floor(Math.random()*n)];
			var b = pop[Math.floor(Math.random()*n)];
			return this.optimize(a.fitness, b.fitness) ? a.entity : b.entity;
		}, "Tournament3": function(pop) {
			var n = pop.length;
			var a = pop[Math.floor(Math.random()*n)];
			var b = pop[Math.floor(Math.random()*n)];
			var c = pop[Math.floor(Math.random()*n)];
			var best = this.optimize(a.fitness, b.fitness) ? a : b;
			best = this.optimize(best.fitness, c.fitness) ? best : c;
			return best.entity;
		}, "Fittest": function (pop) {
			return pop[0].entity;
		}, "Random": function (pop) {
			return pop[Math.floor(Math.random()*pop.length)].entity;
		}, "RandomLinearRank": function (pop) {
			this.internalGenState["rlr"] = this.internalGenState["rlr"]||0;
			return pop[Math.floor(Math.random()*Math.min(pop.length,(this.internalGenState["rlr"]++)))].entity;
		}, "Sequential": function (pop) {
			this.internalGenState["seq"] = this.internalGenState["seq"]||0;
			return pop[(this.internalGenState["seq"]++)%pop.length].entity;
		}
	};
	
	var Select2 = {
		"Tournament2": function(pop) {
			return [Select1.Tournament2.call(this, pop), Select1.Tournament2.call(this, pop)];
		}, "Tournament3": function(pop) {
			return [Select1.Tournament3.call(this, pop), Select1.Tournament3.call(this, pop)];
		}, "Random": function (pop) {
			return [Select1.Random.call(this, pop), Select1.Random.call(this, pop)];
		}, "RandomLinearRank": function (pop) {
			return [Select1.RandomLinearRank.call(this, pop), Select1.RandomLinearRank.call(this, pop)];
		}, "Sequential": function (pop) {
			return [Select1.Sequential.call(this, pop), Select1.Sequential.call(this, pop)];
		}, "FittestRandom": function (pop) {
			return [Select1.Fittest.call(this, pop), Select1.Random.call(this, pop)];
		}
	};
	
	function Genetic() {
		
		// population
		this.fitness = null;
		this.seed = null;
		this.mutate = null;
		this.crossover = null;
		this.select1 = null;
		this.select2 = null;
		this.optimize = null;
		this.generation = null;
		this.notification = null;
		
		this.configuration = {
			"size": 250
			, "crossover": 0.9
			, "mutation": 0.2
			, "iterations": 100
			, "fittestAlwaysSurvives": true
			, "maxResults": 100
			, "webWorkers": true
			, "skip": 0
		};
		
		this.userData = {};
		this.internalGenState = {};
		
		this.entities = [];
		
		this.usingWebWorker = false;
		
		this.start = function() {
			
			var i;
			var self = this;
			
			function mutateOrNot(entity) {
				// applies mutation based on mutation probability
				return Math.random() <= self.configuration.mutation && self.mutate ? self.mutate(Clone(entity)) : entity;
			}
			
			// seed the population
			for (i=0;i<this.configuration.size;++i)  {
				this.entities.push(Clone(this.seed()));
			}
			
			for (i=0;i<this.configuration.iterations;++i) {
				// reset for each generation
				this.internalGenState = {};
				
				// score and sort
				var pop = this.entities
					.map(function (entity) {
						return {"fitness": self.fitness(entity), "entity": entity };
					})
					.sort(function (a, b) {
						return self.optimize(a.fitness, b.fitness) ? -1 : 1;
					});
				
				// generation notification
				var mean = pop.reduce(function (a, b) { return a + b.fitness; }, 0)/pop.length;
				var stdev = Math.sqrt(pop
					.map(function (a) { return (a.fitness - mean) * (a.fitness - mean); })
					.reduce(function (a, b) { return a+b; }, 0)/pop.length);
					
				var stats = {
					"maximum": pop[0].fitness
					, "minimum": pop[pop.length-1].fitness
					, "mean": mean
					, "stdev": stdev
				};

				var r = this.generation ? this.generation(pop, i, stats) : true;
				var isFinished = (typeof r != "undefined" && !r) || (i == this.configuration.iterations-1);
				
				if (
					this.notification
					&& (isFinished || this.configuration["skip"] == 0 || i%this.configuration["skip"] == 0)
				) {
					this.sendNotification(pop.slice(0, this.maxResults), i, stats, isFinished);
				}
					
				if (isFinished)
					break;
				
				// crossover and mutate
				var newPop = [];
				
				if (this.configuration.fittestAlwaysSurvives) // lets the best solution fall through
					newPop.push(pop[0].entity);
				
				while (newPop.length < self.configuration.size) {
					if (
						this.crossover // if there is a crossover function
						&& Math.random() <= this.configuration.crossover // base crossover on specified probability
						&& newPop.length+1 < self.configuration.size // keeps us from going 1 over the max population size
					) {
						var parents = this.select2(pop);
						var children = this.crossover(Clone(parents[0]), Clone(parents[1])).map(mutateOrNot);
						newPop.push(children[0], children[1]);
					} else {
						newPop.push(mutateOrNot(self.select1(pop)));
					}
				}
				
				this.entities = newPop;
			}
		}
		
		this.sendNotification = function(pop, generation, stats, isFinished) {
			var response = {
				"pop": pop.map(Serialization.stringify)
				, "generation": generation
				, "stats": stats
				, "isFinished": isFinished
			};
			
			
			if (this.usingWebWorker) {
				postMessage(response);
			} else {
				// self declared outside of scope
				self.notification(response.pop.map(Serialization.parse), response.generation, response.stats, response.isFinished);
			}
			
		};
	}
	
	Genetic.prototype.evolve = function(config, userData) {
		
		var k;
		for (k in config) {
			this.configuration[k] = config[k];
		}
		
		for (k in userData) {
			this.userData[k] = userData[k];
		}
		
		// determine if we can use webworkers
		this.usingWebWorker = this.configuration.webWorkers
			&& typeof Blob != "undefined"
			&& typeof Worker != "undefined"
			&& typeof window.URL != "undefined"
			&& typeof window.URL.createObjectURL != "undefined";
		
		function addslashes(str) {
			return str.replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
		}
			
		// bootstrap webworker script
		var blobScript = "'use strict'\n";
		blobScript += "var Serialization = {'stringify': " + Serialization.stringify.toString() + ", 'parse': " + Serialization.parse.toString() + "};\n";
		blobScript += "var Clone = " + Clone.toString() + ";\n";
		
		// make available in webworker
		blobScript += "var Optimize = Serialization.parse(\"" + addslashes(Serialization.stringify(Optimize)) + "\");\n";
		blobScript += "var Select1 = Serialization.parse(\"" + addslashes(Serialization.stringify(Select1)) + "\");\n";
		blobScript += "var Select2 = Serialization.parse(\"" + addslashes(Serialization.stringify(Select2)) + "\");\n";
		
		// materialize our ga instance in the worker
		blobScript += "var genetic = Serialization.parse(\"" + addslashes(Serialization.stringify(this)) + "\");\n";
		blobScript += "onmessage = function(e) { genetic.start(); }\n";
		
		var self = this;
		
		if (this.usingWebWorker) {
			// webworker
			var blob = new Blob([blobScript]);
			var worker = new Worker(window.URL.createObjectURL(blob));
			worker.onmessage = function(e) {
			  var response = e.data;
			  self.notification(response.pop.map(Serialization.parse), response.generation, response.stats, response.isFinished);
			};
			worker.onerror = function(e) {
				alert('ERROR: Line ' + e.lineno + ' in ' + e.filename + ': ' + e.message);
			};
			worker.postMessage("");
		} else {
			// simulate webworker
			(function(){
				var onmessage;
				eval(blobScript);
				onmessage(null);
			})();
		}
	}
	
	return {
		"create": function() {
			return new Genetic();
		}, "Select1": Select1
		, "Select2": Select2
		, "Optimize": Optimize
		, "Clone": Clone
	};
	
})();


// so we don't have to build to run in the browser
if (typeof module != "undefined") {
	module.exports = Genetic;
}

},{}],4:[function(require,module,exports){
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
},{"./lib/City":1,"./lib/genetic-js-ext":2}]},{},[4]);
