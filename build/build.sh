  #!/bin/bash
if [ -d "build" ]; then
  cd build
  echo "\\033[1;36mcompiling client scripts...\\033[0m"
  rm -f "client.min.js.gz"
  ../node_modules/requirejs/bin/r.js -o build.js > /dev/null \
  && gzip --keep client.min.js && echo "\\033[1;32mdone.\\033[0m"
  cd ..
fi