var replace = require('replace-in-file');
var value = false;
process.argv.forEach(function(val, index, array) {
  if (index == 2) {
    value = val;
  }
});


const options = {
  files: 'src/environments/environment.prod.ts',
  from: /useLocationHash: (.*)/g,
  to: "useLocationHash: " + value + ",",
};

try {
  let changedFiles = replace.sync(options);
  console.log('useLocationHash set to: ' + value);
} catch (error) {
  console.error('Error occurred:', error);
  throw error
}
