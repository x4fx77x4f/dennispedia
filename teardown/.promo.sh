#!/bin/sh
set -e
if [ -z "$1" ]
then
	curl 'https://teardowngame.com/promo.php' -H 'Host: promo.teardowngame.com'
	exit
fi
wget "https://teardowngame.com/$1" --header="Host: promo.teardowngame.com" -O "teardown/.collection/promo.teardowngame.com/$1"
