const fs = require("fs");
const path = require("path");

const package = path.join(__dirname, "../package.json");
const manifest = path.join(__dirname, "../public/manifest.json");

const packageJson = require(package);
const manifestJson = require(manifest);

manifestJson.version = packageJson.version;

const json = JSON.stringify(manifestJson, null, 4);

fs.writeFileSync(manifest, json);

console.log("Updated manifest.json with version from package.json");