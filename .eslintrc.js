module.exports = {
    root: true,
    parser: 'babel-eslint',
    extends: ['eslint:recommended', 'airbnb-base', 'prettier', 'plugin:prettier/recommended'],
    plugins: ['babel', 'import', 'prettier'],
    parserOptions: {
        ecmaVersion: 2017,
        sourceType: 'module',
        ecmaFeatures: {
            modules: true,
            experimentalObjectRestSpread: true,
        },
    },
    env: {
        node: true,
        browser: false,
        es6: true,
    },
    rules: {
        'no-invalid-this': 0,
        'babel/no-invalid-this': 2,
        'prettier/prettier': [
            'error',
            {
                singleQuote: true,
                tabWidth: 4,
                printWidth: 120,
                trailingComma: 'all',
                jsxBracketSameLine: true,
            },
        ],
    },
};
