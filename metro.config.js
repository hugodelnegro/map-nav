const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname);

// Manually point to the file in node_modules
const withNativeWind = require(path.resolve(
  __dirname,
  "node_modules/nativewind/dist/metro"
)).withNativeWind;

module.exports = withNativeWind(config, { input: "./global.css" });