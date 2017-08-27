var replace = require('replace-in-file');
var value = false;
process.argv.forEach(function(val, index, array) {
  if (index == 2) {
    value = val;
  }
});


const options = {
  files: 'src/environments/environment.prod.ts',
  replace: /useLocationHash: (.*)/g,
  with: "useLocationHash: " + value + ",",
  allowEmptyPaths: false,
};

try {
  let changedFiles = replace.sync(options);
  if (changedFiles == 0) {
    throw "Please make sure that file '" + options.files + "' has \"useLocationHash\"";
  }
  console.log('useLocationHash set to: ' + value);
} catch (error) {
  console.error('Error occurred:', error);
  throw error
}
