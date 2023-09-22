/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  clearMocks: true,
  // NOTE: This is required for mocking with jest and prisma.
  // Currently commented out so that the db tests can run against the database
  setupFilesAfterEnv: ['<rootDir>/app/__test__/mock/prismaMock.ts'],
  // setupFilesAfterEnv: ['<rootDir>/prisma/prisma.ts'],
};
