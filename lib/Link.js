/**
 * This class will help for the greedy initialization of the population
 */

function Link(city1, city2) {
	this.city1 = city1;
	this.city2 = city2;
}
Link.prototype.constructor = Link;

Link.prototype.weight = function () {
	return city1.distanceTo(city2);
}