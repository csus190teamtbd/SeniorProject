#!/usr/bin/env python3

import argparse
import csv
import yaml
import os
import subprocess

def generateYMLfromCSV(csvFile, ymlFile):
  print("\n #####  Converting csv at {} to yml at {} #####\n".format(csvFile, ymlFile))
  with open(csvFile, mode='r',encoding='utf-8') as csv_file:
    csv_reader = csv.reader(csv_file, delimiter='\t')
    english = dict()
    spanish  = dict()
    for en, es, key in iter(csv_reader):
      if key:
        category, subKey = key.split('.')
        if category not in english:
          english[category] = dict()
          spanish [category] = dict()
        english[category][subKey] = en
        spanish [category][subKey] = es
  f = open(ymlFile, 'w',encoding='utf-8')
  # print(english)
  f.write(yaml.dump({ "en": english, "es": spanish }, default_flow_style=False, allow_unicode=True))

def buildWebRelease():
  print("\n #####  Building site_en #####\n")
  subprocess.run('jekyll build -d ./_site_en/', shell=True)

  print("\n #####  zipping site_en #####\n")
  subprocess.run('zip -r ./dist/site_en.zip ./_site_en/', shell=True)

  print("\n #####  Building site_es #####\n")
  subprocess.run('JEKYLL_ENV=es jekyll build -d ./_site_es/', shell=True)

  print("\n #####  zipping site_es #####\n")
  subprocess.run('zip -r ./dist/site_es.zip ./_site_es/', shell=True)

def main(args):    
  inputFile = os.path.abspath(args.input_csv_file)
  outputFile = os.path.abspath(args.output_yml_file)
  generateYMLfromCSV(inputFile, outputFile)
  buildWebRelease()
  # to be done --- Add electron build release
  


if __name__ == '__main__':
  parser = argparse.ArgumentParser(description=
  """convert csv file to yml file""")
  parser.add_argument('-input_csv_file', help='input csv', default = './src/translationSource/translationData.csv')
  parser.add_argument('-output_yml_file', help='output yml', default = './src/_data/translate.yml')
  args = parser.parse_args()
  main(args)