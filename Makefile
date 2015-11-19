build:
	./node_modules/.bin/babel -d ./lib ./src

test:
	./node_modules/.bin/mocha --reporter spec ./spec/**/*.js
