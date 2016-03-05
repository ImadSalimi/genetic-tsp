
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
