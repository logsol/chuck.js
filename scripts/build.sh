#!/bin/bash
if env | grep -q "^NODE_ENV=production$"
then
	echo "[ PRODUCTION ]"
	mkdir -p build
	echo "- compiling client scripts.."
	rm -f "build/client.min.js.gz"
	node_modules/requirejs/bin/r.js -o config/build-profile.js > /dev/null \
		&& gzip -c build/client.min.js > build/client.min.js.gz \
		&& echo "- done."
else 
	echo "[ DEVELOPMENT ]"
fi