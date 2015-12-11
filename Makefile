test: node_modules
	@$</.bin/future-node example.js

node_modules: package.json
	@npm install

.PHONY: test
