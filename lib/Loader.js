// #####################################################################################################################
// ############################################### I M P O R T S #######################################################
// #####################################################################################################################
var fs = require('fs');

// #####################################################################################################################
// ################################################# C L A S S #########################################################
// #####################################################################################################################

function Loader () {
	/* @member {Object} _scripts */
	this._scripts = {};
}

// #####################################################################################################################
// ############################################### M E T H O D S #######################################################
// #####################################################################################################################

/**
 * @method load
 *
 * @description Load a script from an anonymous function or a file
 * 
 * @param  {String} key     	Key associated to the script
 * @param  {Mixed} 	script  	String or a Function
 *                           	If it's a string, then this method try to read a file located at script path
 * @param  {Object} options 	Load options * Optional *
 *                           	{
 *                           		'safe': <Boolean>, // False if you want to override
 *                           		'watch': <Boolean> // True if you want the file reloads when there is an update
 *                           	}
 *
 */
Loader.prototype.load = function (key, script, options) {
	var self = this;

	if(this._scripts[key] !== undefined && this._scripts[key].safe) {
		return;
	}

	if(options === undefined) {
		options = {};
	}

	// Load script
	var fn = null;
	if(typeof(script) === 'function') {
		fn = script;
	} else if(typeof(script) === 'string') {
		// So that's a filename
		fn = eval('(' + fs.readFileSync(script) + ')');
		if(!fn) {
			throw new SyntaxError("Cannot parse script from file");
		}
	} else {
		throw new TypeError("Script argument must be a Function or a String");
	}

	// Add script
	if(this._scripts[key] === undefined) {
		this._scripts[key] = {
			'fn': fn,
			'safe': options.safe || false
		};
	}

	// Bind watcher for script from file
	if(options.watch && typeof(script) === 'string') {
		if(this._scripts[key].watcher) {
			this._scripts[key].watcher.close();
		}
		this._scripts[key].watcher = fs.watch(script, function (evt) {
			if(evt === 'change') {
				var newFn = eval('(' + fs.readFileSync(script) + ')');
				if(!newFn) {
					throw new SyntaxError("Cannot reload file");
				}
				self._scripts[key].fn = newFn;
			}
		});
	}
};

// #####################################################################################################################

/**
 * @method remove
 *
 * @description Method to remove a script from its key
 * 
 * @param  {String} key 	Key of the script to remove
 * 
 */
Loader.prototype.remove = function (key) {
	if(this._scripts[key].watcher !== undefined) {
		this._scripts[key].watcher.close();
	}
	delete this._scripts[key];
};

// #####################################################################################################################

/**
 * @method Method to call a script from its key
 * 
 * @param  {String} key 	Key of the script to call
 *
 */
Loader.prototype.call = function (key) {
	if(this._scripts[key] === undefined) {
		return;
	}

	var args = Array.prototype.slice.call(arguments, 1);
	return this._scripts[key].fn.apply(this, args);
};

// #####################################################################################################################
// ############################################### E X P O R T S #######################################################
// #####################################################################################################################

module.exports = Loader;