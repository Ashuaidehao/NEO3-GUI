const {
  override,
  addDecoratorsLegacy,
  disableEsLint,
  setWebpackTarget,
  addWebpackModuleRule,
} = require("customize-cra");

module.exports = override(
  addDecoratorsLegacy(),
  disableEsLint(),
  setWebpackTarget("electron-renderer") //support native api
  // addWebpackModuleRule({
  //     test: /\walletStore.js?$/,
  //     use: {
  //         loader: 'babel-loader',
  //     },
  //     exclude: /node_modules/,
  // })
);
