module.exports = {
    'rootDir': '../',
    'moduleFileExtensions': [
        'ts',
        'tsx',
        'js'
    ],
    'transform': {
        '^.+\\.(js|ts|tsx)$': '<rootDir>tests/preprocessor.js'
    },
    'testMatch': [
        '**/tests/specs/*.+(ts|tsx|js)'
    ]
};
