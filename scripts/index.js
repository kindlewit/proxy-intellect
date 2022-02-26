'use strict';

const userHandlers = require('./user');
const quizHandlers = require('./quiz');

module.exports = { ...userHandlers, ...quizHandlers };
