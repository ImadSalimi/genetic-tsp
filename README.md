### Genetic Algorithms: Traveling Salesman Problem

Using genetics algorithms to find optimal routes between airports. (WIP)
Airpots data is provided by *<a href="http://openflights.org/data.html" target="_blank">OpenFlights</a>*.

### Meanwhile,
You can have fun with *<a href="http://users.sussex.ac.uk/~inmanh/easy/alife10/ga_exercise.html">The Card Problem</a>*. Here's how to use it:
```
$ npm install
$ node card_problem.js
```

If you want to tweak the configuration you should change this part in the file
```javascript
var config = {
	iterations: 2000,
	size: 100,
	crossover: 0.8,
	mutation: 0.02,
	skip: 5
}

var userData = {
	cards: 10,
	sum: 36,
	product: 360
}
```