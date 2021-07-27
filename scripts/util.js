'use strict';

const _ = require('lodash');

const wordlist = [
  "electrobath", "electrobiology",
  "aardwolves", "paprica",
  "papua", "papulae",
  "solanidin", "zunyite",
  "zurich", "zwitter"
]


// Word Gen Utils
function generateMWords(m = 3, seperator = '') {
  let threeWords = _.sampleSize(wordlist, m);
  while (_.uniq(threeWords).length < (m - 1)) {
    threeWords = _.sampleSize(wordlist, m);
  }
  return _.map(threeWords, _.capitalize).join(seperator);
}

module.exports = {
  generateMWords
}
