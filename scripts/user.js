'use strict';

const {
  now,
  omit,
  cloneDeep,
  merge,
  has,
  find,
  isNil,
  isString,
  isEmpty,
  sampleSize
} = require('lodash');

const DATA = [
  {
    username: 'balasir',
    email: 'bala@sir',
    display_name: 'Bala',
    attended: [],
    created_at: '2021-07-03T14:39:56.886Z'
  },
  {
    username: 'timroth88',
    email: 'tim88@tim',
    display_name: 'Tim Roth',
    attended: [],
    created_at: '2021-06-22T13:43:36.284Z'
  }
];

const IDEAL_DOC = {
  username: null,
  email: null,
  display_name: null,
  attended: [],
  created_at: now(),
  updated_at: now()
};

function sanitize(doc) {
  let cleanObj = cloneDeep(doc);
  for (let key in doc) {
    if (isNil(doc[key]) || key === 'created_at') {
      omit(cleanObj, key);
    }
  }
  if (!isNil(doc.duration)) {
    cleanObj.duration = parseInt(doc.duration);
  }
  if (!isNil(doc.attended) && isString(doc.attended)) {
    cleanObj.attended = doc.attended.split(',');
  }
  return cleanObj;
}

function createUserHandler(event) {
  try {
    let doc = merge(IDEAL_DOC, sanitize(omit(event.body, 'password')));
    return {
      statusCode: 201,
      body: JSON.stringify(doc)
    };
  } catch (e) {
    return { statusCode: 500 };
  }
}

function listUserHandler(event) {
  try {
    let limit = has(event?.queryStringParameters, 'limit')
      ? parseInt(event.queryStringParameters.limit)
      : DATA.length;
    return {
      statusCode: 200,
      body: JSON.stringify({
        total_docs: DATA.length,
        docs: sampleSize(DATA, limit)
      })
    };
  } catch (e) {
    return { statusCode: 500 };
  }
}

function getUserHandler(event) {
  try {
    let doc = find(DATA, {
      username: event.pathParameters.username
    });
    if (isEmpty(doc)) {
      return { statusCode: 404 };
    }
    return {
      statusCode: 200,
      body: JSON.stringify(doc)
    };
  } catch (e) {
    return { statusCode: 500 };
  }
}

function updateUserHandler(event) {
  try {
    let doc = find(DATA, {
      username: event.pathParameters.username
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

function deleteUserHandler() {
  return { statusCode: 204 };
}
module.exports = {
  createUserHandler,
  listUserHandler,
  getUserHandler,
  updateUserHandler,
  deleteUserHandler
};
