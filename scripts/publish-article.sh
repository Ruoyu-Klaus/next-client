#!/bin/sh
# stop execute code when exit
set -e

GIT_STATUS=(git status --porcelain)
if [ -z "${GIT_STATUS}" ];
then
 echo "IT IS CLEAN"
else
 git status
 read -p "Enter your message"  message
 message="${message:=publish:a new article}"
 git add .
 git commit -m":page_facing_up:${message}"
 echo "Publish post to github"
 git push -u origin main
fi
