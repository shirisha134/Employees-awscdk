module.exports = {
  roots: ['<rootDir>/test'],
  testRegex: "^.*?\\.test.ts$",
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  }
};
