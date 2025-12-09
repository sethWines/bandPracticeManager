#!/bin/bash
# Update version.txt from current git branch

BRANCH=$(git branch --show-current)
echo "$BRANCH" > version.txt
echo "Updated version.txt to: $BRANCH"

