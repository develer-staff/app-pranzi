module.exports = {
    "extends": [
        "standard",
        "plugin:react/recommended"
    ],
    "plugins": [
        "standard",
        "promise",
        "react",
        "react-native"
    ],
    "rules": {
        "semi": ["error", "always"],
        "space-before-function-paren": ["error", { "anonymous": "always", "named": "never" }],
        "no-var": "error",
        "react-native/no-unused-styles": "error",
        "react-native/split-platform-components": "error",
        "prefer-const": "error",
        "no-unused-vars": ["error", { "vars": "all", "args": "after-used" }],
        "comma-dangle": "off"
    },
    "env": {
        "node": true
    },
    "globals": {
        "fetch": false
    },
    "ecmaFeatures": {
        "jsx": true
    }
};