module.exports = {
    root: true,
    extends: ["@react-native", "plugin:prettier/recommended"],
    plugins: ["prettier"],
    rules: {
        semi: ["error", "always"],
        quotes: ["error", "double"],
        "prettier/prettier": "error"
    }
};
