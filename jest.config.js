module.exports = {
  testEnvironment: 'node',
  testRegex: '(app|common|templates|test)/.*\\.(test|spec)?\\.(js)$',
  moduleFileExtensions: ['js', 'json'],
  watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname'],
};
