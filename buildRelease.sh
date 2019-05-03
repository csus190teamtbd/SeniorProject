#!/bin/bash
rm -r ./dist
python3 ./generateYML.py
JEKYLL_ENV=es jekyll build -d ./dist/es 
jekyll build -d ./dist/en
cp ./index.html ./dist
