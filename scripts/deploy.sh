#!/bin/bash

# Get dir of this script
DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )/..

if [ -z "$1" ]
then
	pm2 deploy $DIR/config/ecosystem-dev.json5 dev
	exit 
fi

if [ "$1" == "production" ]
then
	pm2 deploy $DIR/config/ecosystem.json5 production
	exit 
fi

echo "Case ($1) not defined. doing nothing."