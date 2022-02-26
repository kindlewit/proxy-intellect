'use strict';

const {
  now,
  omit,
  cloneDeep,
  merge,
  has,
  chain,
  find,
  isNil,
  isString,
  isEmpty
} = require('lodash');

const { generateMWords } = require('./util');
const DATA = require('./data/quiz-data.json');

const IDEAL_DOC = {
  three_words: null,
  url: null,
  title: null,
  description: null,
  topics: [],
  start: null,
  duration: null,
  file_upload: true,
  status: 0,
  username: null,
  created_at: now(),
  updated_at: now()
};

function sanitize(doc) {
  let cleanObj = cloneDeep(doc);
  for (let key in doc) {
    if (isNil(doc[key]) || key === 'created_at' || key === 'three_words') {
      // Cannot insert user-defined created_at / three_words
      omit(cleanObj, key);
    }
  }
  if (!isNil(doc.duration) && isString(doc.duration)) {
    cleanObj.duration = parseInt(doc.duration);
  }
  if (!isNil(doc.topics) && isString(doc.topics)) {
    cleanObj.topics = doc.topics.split(',');
  }
  return cleanObj;
}

function createQuizHandler(event) {
  try {
    let doc = merge(IDEAL_DOC, sanitize(event.body));
    doc.three_words = generateMWords(3, '-');
    return {
      statusCode: 201,
      body: JSON.stringify(doc)
    };
  } catch (e) {
    return { statusCode: 500 };
  }
}

function listQuizHandler(event) {
  try {
    let limit = has(event?.queryStringParameters, 'limit')
      ? parseInt(event.queryStringParameters.limit)
      : DATA.length;
    let docs = chain(DATA)
      .sampleSize(limit)
      .map((o) => omit(o, ['questions', 'responses']))
      .value();
    return {
      statusCode: 200,
      body: JSON.stringify({
        total_docs: DATA.length,
        docs
      })
    };
  } catch (e) {
    return { statusCode: 500 };
  }
}

function getQuizHandler(event) {
  try {
    let doc = find(DATA, {
      three_words: event.pathParameters.threeWords
    });
    if (isEmpty(doc)) {
      return { statusCode: 404 };
    }
    return {
      statusCode: 200,
      body: JSON.stringify(omit(doc, ['questions', 'responses']))
    };
  } catch (e) {
    return { statusCode: 500 };
  }
}

function updateQuizHandler(event) {
  try {
    let doc = find(DATA, {
      three_words: event.pathParameters.threeWords
    });
    if (isEmpty(doc)) {
      return { statusCode: 404 };
    }
    return {
      statusCode: 200,
      body: JSON.stringify(merge(doc, sanitize(event.body)))
    };
  } catch (e) {
    return { statusCode: 500 };
  }
}

function deleteQuizHandler() {
  return { statusCode: 204 };
}

function collateQuizHandler(event) {
  let doc = chain(DATA)
    .find({
      three_words: event.pathParameters.threeWords
    })
    .omit('responses')
    .value();
  doc.questions = doc.questions.map((qn) => {
    return omit(qn, 'answers');
  });
  if (isEmpty(doc)) {
    return { statusCode: 404 };
  }
  return {
    statusCode: 200,
    body: JSON.stringify(doc)
  };
}

function evaluateQuizHandler(event) {
  let { method } = event.requestContext.http;
  console.log(method);
  let { threeWords } = event.pathParameters;
  switch (method) {
    case 'GET': {
      let doc = find(DATA, {
        three_words: threeWords
      });
      if (isEmpty(doc)) {
        return { statusCode: 404 };
      }
      return {
        statusCode: 200,
        body: JSON.stringify(doc)
      };
    }
    case 'POST': {
      return {
        statusCode: 201,
        body: JSON.stringify(event.body)
      };
    }
    case 'PUT': {
      return { statusCode: 200 };
    }
    default: {
      break;
    }
  }
  return { statusCode: 500 };
}

module.exports = {
  createQuizHandler,
  listQuizHandler,
  getQuizHandler,
  updateQuizHandler,
  deleteQuizHandler,
  collateQuizHandler,
  evaluateQuizHandler
};
