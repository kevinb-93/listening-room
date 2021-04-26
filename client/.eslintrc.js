module.exports = {
    root: true,
    parser: '@typescript-eslint/parser', // Specifies the ESLint parser
    parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true
        }
    },
    env: {
        node: true,
        es6: true,
        commonjs: true,
        browser: true
    },
    extends: [
        'eslint:recommended',
        'plugin:react/recommended', // Uses the recommended rules from @eslint-plugin-react
        'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
        'plugin:react-hooks/recommended',
        'plugin:prettier/recommended' // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
    ],
    plugins: ['@typescript-eslint'],
    rules: {
        // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
        'react/prop-types': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off'
    },
    settings: {
        react: {
            version: 'detect'
        }
    }
};
