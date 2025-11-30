export default {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    roots: ['<rootDir>/src'],
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
    extensionsToTreatAsEsm: ['.ts', '.tsx'],
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    transform: {
        '^.+\\.tsx?$': ['ts-jest', {
            useESM: true,
            tsconfig: {
                jsx: 'react-jsx',
                esModuleInterop: true,
                allowSyntheticDefaultImports: true,
                module: 'esnext',
            },
        }],
    },
    transformIgnorePatterns: [
        'node_modules/(?!(@testing-library)/)',
    ],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
    testMatch: ['**/__tests__/**/*.(test|spec).(ts|tsx)', '**/*.(test|spec).(ts|tsx)'],
};
