const fs = require('fs');

console.log('Deleting unused files...');
fs.rmSync('./src/', { recursive: true, force: true });
fs.rmSync('./tslint.json');
fs.rmSync('./tsconfig.json');
fs.rmSync('./.gitignore');

fs.unlinkSync('./install.js');