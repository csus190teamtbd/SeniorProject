#!/bin/bash
rm -r ./dist
python3 ./generateYML.py
if [ $1 == "exe" ]
then
  rm -r ./dist_electron
  jekyll build -d ./dist/es --config _config.yml,_config_exe.yml,_config_es.yml
  jekyll build -d ./dist/en --config _config.yml,_config_exe.yml,_config_en.yml
  mkdir dist_electron
  cp ./electron_add_on/readme.txt ./dist_electron
else
  jekyll build -d ./dist/es --config _config.yml,_config_web.yml,_config_es.yml
  jekyll build -d ./dist/en --config _config.yml,_config_web.yml,_config_en.yml
fi
TARGET_DIR=dist/es npx webpack 
TARGET_DIR=dist/en npx webpack 
cp ./electron_add_on/index.html ./dist
