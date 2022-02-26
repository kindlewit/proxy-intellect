'use strict';

const { sampleSize, uniq, capitalize } = require('lodash');

const wordlist = [
  'electrobath',
  'electrobiology',
  'aardwolves',
  'paprica',
  'papua',
  'papulae',
  'solanidin',
  'zunyite',
  'zurich',
  'zwitter'
];

// Word Gen Utils
function generateMWords(m = 3, seperator = '') {
  let threeWords = sampleSize(wordlist, m);
  while (uniq(threeWords).length < m - 1) {
    threeWords = sampleSize(wordlist, m);
  }
  return threeWords.map(capitalize).join(seperator);
}

module.exports = {
  generateMWords
};
