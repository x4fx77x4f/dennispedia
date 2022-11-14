#!/bin/sh
collection="${collection:-$(realpath "$(dirname "$0")/.collection")}"
if [ $# -eq 0 ]
then
	echo "Usage: [collection=PATH] [fast=1] ./.strings_bin.sh [PATTERN]"
	echo "Runs \`strings\` on each Teardown binary level after decompression, and optionally pipe the result to \`grep -F PATTERN\`."
	echo "This script is very slow and very CPU intensive, so you may want to define the fast environment variable so that only one level from each version will be checked."
	echo "If collection environment variable is undefined, .collection directory in script's parent directory will be used instead (i.e. '$collection')."
	echo "Files that will be checked will be all files in \"\$collection/depots/1167634/*/teardown.exe\", as well as \"\$collection/teardown-perftest/teardown-perftest.exe\"."
	exit
fi
check() {
	printf "\t\e[2m%s\e[0m\n" "$1"
	if [ -z "$2" ]
	then
		zlib-flate -uncompress < "$1" | strings
	else
		zlib-flate -uncompress < "$1" | strings | grep -F "$2"
	fi
}
check_dir() {
	dir="$1"
	shift
	if [ -z "$fast" ]
	then
		for file in "$dir/data/bin/"*".bin"
		do
			check "$file" $@
		done
	else
		if [ -f "$dir/data/bin/test.bin" ]
		then
			check "$dir/data/bin/test.bin" $@
		else
			check "$dir/data/bin/lee_sandbox.bin" $@
		fi
	fi
}
check_dir "$collection/teardown-perftest/" $@
for file in "$collection/depots/1167634/"*"/"
do
	check_dir "$file" $@
done
