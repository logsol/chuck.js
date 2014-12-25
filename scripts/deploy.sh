#!/bin/bash

DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )/..

if [ -z "$1" ]
then
	pm2 deploy $DIR/config/ecosystem.json5 dev
else 
	pm2 deploy $DIR/config/ecosystem.json5 $1
fi