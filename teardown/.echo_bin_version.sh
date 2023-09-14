#!/bin/sh
set -e
wd="$(dirname "$0")"
for buildid_path in "$wd/.collection/depots/1167634/"*
do
	buildid="$(basename "$buildid_path")"
	level_path="$buildid_path/data/bin/lee_sandbox.bin"
	version="$(zlib-flate -uncompress < "$level_path" | "$wd/.echo_bin_version.lua")"
	#printf -- "buildid: '%s', level_path: '%s'\n" "$buildid" "$level_path"
	printf -- "%s: %s\n" "$buildid" "$version"
done
