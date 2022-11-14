#!/bin/sh
collection="${collection:-$(realpath "$(dirname "$0")/.collection")}"
if [ $# -eq 0 ]
then
	echo "Usage: [collection=PATH] ./.grep_exe.sh PATTERN"
	echo "Runs \`grep -F PATTERN\` for each Teardown executable."
	echo "If collection environment variable is undefined, .collection directory in script's parent directory will be used instead (i.e. '$collection')."
	echo "Files that will be checked will be all files in \"\$collection/depots/1167634/*/teardown.exe\", as well as \"\$collection/teardown-perftest/teardown-perftest.exe\"."
	exit
fi
check() {
	grep -F "$2" "$1"
}
check "$collection/teardown-perftest/teardown-perftest.exe" $@
for file in "$collection/depots/1167634/"*"/teardown.exe"
do
	check "$file" $@
done
