module.exports = {
  parser: "babel-eslint",
  extends: ["eslint:recommended", "prettier"],
  rules: {
    semi: ["warn", "never"],
    "no-console": "off",
    "no-unused-vars": ["error", { argsIgnorePattern: "_" }],
    "no-underscore-dangle": "off",
    "import/prefer-default-export": "off",
    "flowtype/no-types-missing-file-annotation": "off",
    "no-shadow": "off",
    "global-require": "off",
    "no-unused-expressions": "off",
    "no-restricted-globals": ["error", "event", "fdescribe"],
  },
  env: {
    browser: true,
    es6: true,
    node: true,
  },
};
