var replace = require('replace-in-file');
var package = require("./package.json");
var buildVersion = package.version;
const options = {
  files: 'src/environments/environment.prod.ts',
  replace: /version: '(.*)'/g,
  with: "version: '" + buildVersion + "'",
};

try {
  let changedFiles = replace.sync(options);
  console.log('Build version set: ' + buildVersion);
} catch (error) {
  console.error('Error occurred:', error);
  throw error
}
