#!/bin/sh
# stop execute code when exit
set -e
GREEN='\033[0;32m'
NORMAL='\033[0m'

current_branch=$(git branch --show-current)
chenged=$(git status | grep "posts/" | sed 's/.md//;s/^\t*//' | tr '\n' ',' | sed 's/,$/\n/' | cut -b -20)
message=${1:-📝publish blog: 🏷️ $chenged}

echo '🌲 Current branch: ' $GREEN$current_branch$NORMAL

if [[ ! $chenged ]]; then
    echo '🈚 No markdown file changed ❗'
    echo '🏖️  Have a nice day!'
    exit 0
fi
git add .
git commit -m "$message"

echo $GREEN$message$NORMAL

git push -u origin $current_branch
