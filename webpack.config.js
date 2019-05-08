const dir = process.env.TARGET_DIR || '_site';

module.exports = {
  mode: 'development',
  entry: {
    //oneProportion:  './_site/oneProportion/oneProportionEntry.js',
    twoProportions: `./${dir}/twoProportions/twoProportionsEntry.js`,
    //oneMean:  './_site/oneMean/oneMeanEntry.js',
    //twoMean: './_site/twoMean/twoMeanEntry.js',
  },
  output: {
    filename: '[name]/[name].bundle.js',
    path: __dirname + `/${dir}`,
  },
  module: {
    rules: [
      {
        test: /\.js/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  }
};
