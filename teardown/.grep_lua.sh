#!/bin/sh
collection="${collection:-$(realpath "$(dirname "$0")/.collection")}"
if [ $# -eq 0 ]
then
	echo "Usage: [collection=PATH] ./.grep_lua.sh PATTERN"
	echo "Runs \`grep -F PATTERN\` on every Teardown Lua script (excluding achievements.lua as it is encrypted)."
	echo "If collection environment variable is undefined, .collection directory in script's parent directory will be used instead (i.e. '$collection')."
	echo "Files that will be checked will be all files in \"\$collection/depots/1167634/*/**.lua\", as well as \"\$collection/teardown-perftest/**.lua\"."
	exit
fi
check() {
	grep --color=auto --include \*.lua -RF -- "$2" "$1"
}
check "$collection/teardown-perftest/" $@
for file in "$collection/depots/1167634/"*"/"
do
	check "$file" $@
done
