#!/usr/bin/env python3

import argparse
import csv
import yaml
import os

def generateYMLfromCSV(csvFile, ymlFile):
  with open(csvFile, mode='r',encoding='utf-8') as csv_file:
    csv_reader = csv.reader(csv_file, delimiter='\t')
    english = dict()
    spanish  = dict()
    for en, es, key in iter(csv_reader):
      print(en)
      if key:
        category, subKey = key.split('.')
        if category not in english:
          english[category] = dict()
          spanish [category] = dict()
        english[category][subKey] = en
        spanish [category][subKey] = es
  f = open(ymlFile, 'w',encoding='utf-8')
  f.write(yaml.dump({ "en": english, "es": spanish }, default_flow_style=False, allow_unicode=True))

def main(args):    
  inputFile = os.path.abspath(args.input_csv_file)
  outputFile = os.path.abspath(args.output_yml_file)
  generateYMLfromCSV(inputFile, outputFile)


if __name__ == '__main__':
  parser = argparse.ArgumentParser(description=
  """convert csv file to yml file""")
  parser.add_argument('input_csv_file', help='input csv')
  parser.add_argument('output_yml_file', help='output yml')

  args = parser.parse_args()
  main(args)