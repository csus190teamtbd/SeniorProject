#!/bin/bash
rm -r ./dist
python ./generateYML.py
jekyll build -d ./dist/es --config _config.yml,_config_web.yml,_config_es.yml
jekyll build -d ./dist/en --config _config.yml,_config_web.yml,_config_en.yml
cp ./index.html ./dist
