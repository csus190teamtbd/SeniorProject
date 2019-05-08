# SAVIS

### Dependencies

 - Ruby and the 'bundle' gem
 - node and npm (idk what versions, just something not ancient)
 - python3, python3-pip, and `pip3 install pyyaml`

### Running a Dev Server
#### Without Webpack
```bash
$ JEKYLL_ENV=development bundle exec jekyll serve
```
 - Probably open on localhost:4000

#### With Webpack

In three separate terminals:
```bash
$ bundle exec jekyll build -w
```
```bash
$ TARGET_DIR=_site npx webpack -w
```
```bash
$ cd _site && python3 -m http.server 4000
```

 - This is more complicated because it has multiple compilation steps
 - However, it more closely resembles the production environment

### Building for Production (Web)
```bash
$ bash buildRelease.sh web
```
 - host the static files in dist/

### Building for Production (Exe)
```bash
$ bash buildRelease.sh exe
$ npm run package-linux
$ npm run package-mac
$ npm run package-win
```
 - Look at console for executable file location
 - Windows might not be able to build all targets
 - Most flexible way to build is on linux/mac with wine32 installed
