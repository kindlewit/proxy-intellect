'use strict';

const _ = require('lodash');

const { generateMWords } = require('./util');
const DATA = require('./quiz-data.json');

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
  created_at: _.now(),
  updated_at: _.now()
};

function sanitize(doc) {
  let cleanObj = _.cloneDeep(doc);
  for (let key in doc) {
    if (_.isNil(doc[key]) || key === 'created_at' || key === 'three_words') {
      // Cannot insert user-defined created_at / three_words
      _.omit(cleanObj, key);
    }
  }
  if (!_.isNil(doc.duration) && _.isString(doc.duration)) {
    cleanObj.duration = parseInt(doc.duration);
  }
  if (!_.isNil(doc.topics) && _.isString(doc.topics)) {
    cleanObj.topics = doc.topics.split(',');
  }
  return cleanObj;
}

function createQuizHandler(event) {
  try {
    let doc = _.merge(IDEAL_DOC, sanitize(event.body));
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
    let limit = _.has(event?.queryStringParameters, 'limit')
      ? parseInt(event.queryStringParameters.limit)
      : DATA.length;
    let docs = _.chain(DATA)
      .sampleSize(limit)
      .map((o) => _.omit(o, ['questions', 'responses']))
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
    let doc = _.find(DATA, {
      three_words: event.pathParameters.threeWords
    });
    if (_.isEmpty(doc)) {
      return { statusCode: 404 };
    }
    return {
      statusCode: 200,
      body: JSON.stringify(
        _.omit(doc, ['questions', 'responses'])
      )
    };
  } catch (e) {
    return { statusCode: 500 };
  }
}

function updateQuizHandler(event) {
  try {
    let doc = _.find(DATA, {
      three_words: event.pathParameters.threeWords
    });
    if (_.isEmpty(doc)) {
      return { statusCode: 404 };
    }
    return {
      statusCode: 200,
      body: JSON.stringify(_.merge(doc, sanitize(event.body)))
    };
  } catch (e) {
    return { statusCode: 500 };
  }
}

function deleteQuizHandler(event) {
  return { statusCode: 204 };
}

function collateQuizHandler(event) {
  let doc = _.chain(DATA)
    .find({
      three_words: event.pathParameters.threeWords
    })
    .omit('responses')
    .value();
  doc.questions = doc.questions.map((qn) => {
    return _.omit(qn, 'answers');
  });
  if (_.isEmpty(doc)) {
    return { statusCode: 404 };
  }
  return {
    statusCode: 200,
    body: JSON.stringify(doc)
  }
}

function evaluateQuizHandler(event) {
  let { method } = event.requestContext.http;
  console.log(method);
  let { threeWords } = event.pathParameters;
  switch (method) {
    case 'GET': {
      let doc = _.find(DATA, {
        three_words: threeWords
      });
      if (_.isEmpty(doc)) {
        return { statusCode: 404 };
      }
      return {
        statusCode: 200,
        body: JSON.stringify(doc)
      }
    }
    case 'POST': {
      return {
        statusCode: 201,
        body: JSON.stringify(event.body)
      }
    }
    case 'PUT': {
      return { statusCode: 200 }
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
