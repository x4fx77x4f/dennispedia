#!/usr/bin/env luajit
local magic = io.read(5)
assert(magic == "TDBIN")
local version = io.read(3)
assert(#version == 3)
local major, minor, patch = string.byte(version, 1, 3)
io.write(string.format("%u.%u.%u", major, minor, patch))
