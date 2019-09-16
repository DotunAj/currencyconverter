const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    filename: "./js/main.js",
    path: path.resolve(__dirname, "dist")
  }
};
