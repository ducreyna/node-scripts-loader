# node-scripts-loader

Node Module to load functions or scripts on the fly. 

If you load a script from a file, you can activate `watch` option that will reload it automatically when you update the file. __Be careful__ to correctly update your file, otherwise an exception will be thrown.

## Installation

You can git clone this repo with the following methods:

- `git clone https://github.com/ducreyna/node-scripts-loader.git`

You can also add this project as a dependency in your nodejs project by editing the `package.json` file as follow:

```json
{
	"dependencies": {
		"scripts-loader": "https://github.com/ducreyna/node-scripts-loader.git"
	}
}
```

## How to use ?

```javascript
var path = require('path');
var Loader = require('scripts-loader');

var loader = new Loader();

try {
	// Add an anonymous function
	var sumKey = "sum";
	var sumFn = function (a, b) {
		return a + b;
	};
	loader.load(sumKey, sumFn, { 'safe': true });
	
	// Add script from a file and watch updates
	var fileKey = "diff";
	var filename = path.resolve(__dirname, "./myScript.js"); // function (a, b) { return a - b; }
	loader.load(fileKey, filename, { 'safe': false, 'watch': true });
	
	// Call script
	loader.call(sumKey, 1, 1);
	
	// Update anonymous function
	loader.load(sumKey, function (a, b, c) { return a + b + c;}); // Do nothing because 'safe' option was true on that key
	
	// Remove script
	loader.remove(diffKey);
}
catch(expt) {
	console.log(expt);
}
```

