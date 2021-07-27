const {
  createUserHandler,
  listUserHandler,
  getUserHandler,
  updateUserHandler,
  deleteUserHandler
} = require('./user');
const {
  createQuizHandler,
  listQuizHandler,
  getQuizHandler,
  updateQuizHandler,
  deleteQuizHandler,
  collateQuizHandler,
  evaluateQuizHandler
} = require('./quiz');

module.exports = {
  createUserHandler,
  listUserHandler,
  getUserHandler,
  updateUserHandler,
  deleteUserHandler,
  createQuizHandler,
  listQuizHandler,
  getQuizHandler,
  updateQuizHandler,
  deleteQuizHandler,
  collateQuizHandler,
  evaluateQuizHandler
};
