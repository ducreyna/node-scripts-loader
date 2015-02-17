all: hint unit

hint:
	./node_modules/.bin/jshint ./lib/*.js

unit:
	./node_modules/.bin/mocha ./test/*.js