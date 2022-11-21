#!/bin/sh
collection="${collection:-$(realpath "$(dirname "$0")/.collection")}"
if [ $# -eq 0 ]
then
	echo "Usage: [collection=PATH] ./.strings_exe.sh [PATTERN]"
	echo "Runs \`strings\` on each Teardown executable, and optionally pipe the result to \`grep -F PATTERN\`."
	echo "If collection environment variable is undefined, .collection directory in script's parent directory will be used instead (i.e. '$collection')."
	echo "Files that will be checked will be all files in \"\$collection/depots/1167634/*/teardown.exe\", as well as \"\$collection/teardown-perftest/teardown-perftest.exe\"."
	exit
fi
check() {
	printf "\t\e[2m%s\e[0m\n" "$1"
	if [ -z "$2" ]
	then
		strings -- "$1"
	else
		strings -- "$1" | grep -F -- "$2"
	fi
}
check "$collection/teardown-perftest/teardown-perftest.exe" $@
for file in "$collection/depots/1167634/"*"/teardown.exe"
do
	check "$file" $@
done
