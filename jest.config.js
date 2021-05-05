module.exports = {
  roots: ['<rootDir>/src'],
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  transform: {
    '.+\\.ts$': 'ts-jest'
  },
  preset: '@shelf/jest-mongodb',
  moduleNameMapper: {
    '@/tests/(.*)': '<rootDir>/tests/$1',
    '@/(.*)': '<rootDir>/src/$1'
  },
  coveragePathIgnorePatterns: [
    '<rootDir>/src/presentation/controllers/signup/signup-protocols.ts',
    '<rootDir>/src/presentation/protocols',
    '<rootDir>/src/main/server.ts',
    '<rootDir>/src/main/config/env.ts'

  ]

}
