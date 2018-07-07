var package = require("./package.json");
var replace = require('replace-in-file');
var buildVersion = package.version;
const options = {
  files: 'src/environments/environment.prod.ts',
  from: /version: '(.*)'/g,
  to: "version: '" + buildVersion + "'",
};

try {
  let changedFiles = replace.sync(options);
  console.log('Build version set: ' + buildVersion);
} catch (error) {
  console.error('Error occurred:', error);
  throw error
}
