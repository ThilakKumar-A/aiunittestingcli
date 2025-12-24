module.exports = {
  preset: 'jest-preset-angular',
  testEnvironment: 'jsdom',

  transform: {
    '^.+\\.(ts|js|html|mjs)$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.spec.json',
        useESM: true,
      },
    ],
  },
  extensionsToTreatAsEsm: ['.ts'],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?@angular|rxjs)',
  ],

  moduleFileExtensions: ['ts', 'html', 'js', 'json', 'mjs'],
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
};
