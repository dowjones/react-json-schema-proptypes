build:
	./node_modules/.bin/babel -d ./lib ./src

test: build lint
	./node_modules/.bin/mocha --reporter spec ./spec/**/*.js

lint:
	./node_modules/.bin/eslint ./src
