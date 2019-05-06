#!/bin/bash
rm -r ./dist
python ./generateYML.py
if [ $1 == "exe" ]
then
  jekyll build -d ./dist/es --config _config.yml,_config_exe.yml,_config_es.yml
  jekyll build -d ./dist/en --config _config.yml,_config_exe.yml,_config_en.yml
else
  jekyll build -d ./dist/es --config _config.yml,_config_web.yml,_config_es.yml
  jekyll build -d ./dist/en --config _config.yml,_config_web.yml,_config_en.yml
fi
cp ./index.html ./dist
