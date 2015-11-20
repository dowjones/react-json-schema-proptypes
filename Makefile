build:
	./node_modules/.bin/babel -d ./lib ./src

test: build lint flow
	./node_modules/.bin/mocha --compilers js:babel-core/register --recursive --reporter spec ./spec/**/*.js

lint:
	./node_modules/.bin/eslint ./src

flow:
	./node_modules/.bin/flow
