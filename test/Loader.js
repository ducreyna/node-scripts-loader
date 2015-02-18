var path = require('path');
var fs = require('fs');
var assert = require('assert');
var Loader = require('../lib/Loader.js');

var loader = new Loader();

describe('Hot scripts loader', function () {
	// Sum script
	var sumKey = "sum";
	var sum = function (a, b) {
		return a + b;
	};
	// Diff script
	var filename = path.resolve(__dirname, "./test.js");
	var diffKey = "diff";
	var diff = function (a, b) {
		return a - b;
	};

	after(function () {
		loader.remove(diffKey);
		fs.unlinkSync(filename);
	});

	it('Load anonymous function', function () {
		loader.load(sumKey, sum);

		// Asserts
		assert.notStrictEqual(Object.keys(loader._scripts).indexOf(sumKey), -1);
	});

	it('Load script file', function () {
		fs.writeFileSync(filename, diff.toString());
		loader.load(diffKey, filename, { 'watch': true});

		// Asserts
		assert.notStrictEqual(Object.keys(loader._scripts).indexOf(diffKey), -1);
	});

	it('Call anonymous function', function () {
		var a = 1, b = 1;
		var result = sum(a, b);

		// Asserts
		assert.strictEqual(loader.call(sumKey, a, b), result);
	});

	it('Call function from file', function () {
		var a = 1, b = 1;
		var result = diff(a, b);

		// Asserts
		assert.strictEqual(loader.call(diffKey, a, b), result);
	});

	it('Update script which is watching', function (done) {
		diff = function (a, b, c) {
			return a - b - c;
		};
		var a = 3, b = 2, c = 1;
		var result = diff(a, b, c);

		fs.writeFileSync(filename, diff.toString());

		// Waiting that 'change' watch event fires
		setTimeout(function () {
			// Asserts
			assert.strictEqual(loader.call(diffKey, a, b, c), result);
			done();
		}, 10);
	});

	it('Remove script', function () {
		loader.remove(sumKey);

		// Asserts
		assert.strictEqual(Object.keys(loader._scripts).indexOf(sumKey), -1);
	});
});



