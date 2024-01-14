#!/bin/bash

mid=$(ps -ef |grep 'next-server'|grep -v 'grep'|awk '{ print $2 }')
if [ -z "$mid" ];then
  echo "id: $mid"
else
  echo "kill $mid"
  kill -9 $mid
fi
