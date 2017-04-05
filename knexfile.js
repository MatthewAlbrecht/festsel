module.exports = {
  development: {
    client: 'pg',
    connection: 'postgres://localhost/festdb'
  },
  test: {
    client: 'pg',
    connection: 'postgres://localhost/festtestdb'
  }
};
