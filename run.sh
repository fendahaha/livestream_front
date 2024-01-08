#!/usr/bin/env bash

yarn install
[ $? -eq 0 ] && yarn build --no-lint

if [ $? -eq 0 ]; then
  nohup yarn start > log.txt 2>&1 &
fi