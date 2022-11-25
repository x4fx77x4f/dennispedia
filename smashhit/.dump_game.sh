#!/bin/sh
set -e
root="$(dirname "$(realpath "$0")")"
if [ $# -eq 0 ]
then
	echo "Usage: ./.dump_game.sh GAMENAME"
	exit
fi
dump_lib() {
	game="$1"
	apk="$2"
	arch="$3"
	unzip -j "$apk" "lib/${arch}/lib${game}.so" -d "${root}/.lib/" || return 0
	version="$(printf "%s" "${apk}" | grep -Po '(?<=_v)\d+(?=\.apk$)')"
	mv "${root}/.lib/lib${game}.so" "${root}/.lib/lib${game}_v${version}_${arch}.so"
}
dump_game() {
	game="$1"
	for apk in "${root}/apk/com.mediocre.${game}_v"*".apk"
	do
		dump_lib "$game" "$apk" "arm64-v8a"
		dump_lib "$game" "$apk" "armeabi-v7a"
		dump_lib "$game" "$apk" "x86"
	done
}
dump_game "$1"
