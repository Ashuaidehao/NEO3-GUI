module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ["plugin:vue/essential", "eslint:recommended", "@vue/prettier"],
  rules: {
    "no-console": ["warn", { allow: ["warn", "error"] }],
  },
  parserOptions: {
    parser: "babel-eslint",
    ecmaVersion: 6,
  },
};
