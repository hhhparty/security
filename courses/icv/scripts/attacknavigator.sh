#!/bin/bash
# This shell script is used to install Attack Navigator in Ubuntu.

echo "Attack Navigator installing..."
if [ -f "/home/"$(whoami)"/attack-navigator-4.3.tar.gz" ]; then
echo "The image of attack-navigator-4.3.tar.gz existed."
fi

if [! -d "/opt/attack-navigator-4.3" ]; then

fi
apt install npm
cd nav-app
npm install
