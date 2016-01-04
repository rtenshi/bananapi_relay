#!/bin/sh
gpio mode 1 out
gpio mode 2 out
gpio mode 3 out
gpio write 1 0
gpio write 2 0
gpio write 3 0

node /home/test/socket/server.js
echo "Server Online"
