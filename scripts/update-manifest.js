const fs = require("fs");
const path = require("path");

const manifest = path.join(__dirname, "../public/manifest.json");

const manifestJson = require(manifest);

manifestJson.version = process.argv[2];

const json = JSON.stringify(manifestJson, null, 4);

fs.writeFileSync(manifest, json);

console.log("Updated manifest.json with version " + process.argv[2]);