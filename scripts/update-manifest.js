const fs = require("fs");
const path = require("path");

const updateVersion = (file, version) => {
    const filePath = path.join(__dirname, file);

    const json = JSON.parse(fs.readFileSync(filePath, "utf8"));

    json.version = version;

    const output = JSON.stringify(json, null, 4);

    fs.writeFileSync(filePath, output);

    console.log(`Updated ${file.split('/').pop()} with version ${version}`);
}

updateVersion("../public/manifest.json", process.argv[2]);
updateVersion("../package.json", process.argv[2]);