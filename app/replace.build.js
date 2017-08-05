var replace = require('replace-in-file');
var package = require("./package.json");
var buildVersion = package.version;
const options = {
  files: 'src/environments/environment.prod.ts',
  replace: /version: '(.*)'/g,
  with: "version: '" + buildVersion + "'",
  allowEmptyPaths: false,
};

try {
  let changedFiles = replace.sync(options);
  if (changedFiles == 0) {
    throw "Please make sure that file '" + options.files + "' has \"version: ''\"";
  }
  console.log('Build version set: ' + buildVersion);
} catch (error) {
  console.error('Error occurred:', error);
  throw error
}
