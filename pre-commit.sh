#!/bin/bash

failed=0

for file in $(git diff --diff-filter=d --cached --name-only | grep -E '(src\/)(.*)(js)$')
do
  ./node_modules/.bin/eslint "$file" --fix # we only want to lint the staged changes, not any un-staged changes
  if [ $? -ne 0 ]; then
    failed=1
  else
    git add "$file" # Add file to git if no eslint issues found
  fi
done

if [ "$failed" -ne "0" ]; then
  echo "ESLint failed on some staged file(s), Please check your code and try again."
  echo "You can run ESLint manually via 'yarn run eslint' or 'yarn run eslint --fix'\n"
  exit 1 # exit with failure status
fi
