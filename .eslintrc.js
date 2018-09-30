module.exports = {
    root: true,
    extends: [
        'eslint-config-alloy/typescript-react'
    ],
    rules: {
        'no-unused-expressions': [0, { allowShortCircuit: true, allowTernary: true, allowTaggedTemplates: true }],
        'typescript/unescapeIdentifier': 'off',
    }
};