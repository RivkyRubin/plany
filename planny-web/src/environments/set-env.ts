// const setEnv = () => {
//     const fs = require('fs');
//     const writeFile = fs.writeFile;
//   // Configure Angular `environment.ts` file path
//     const targetPath = './src/environments/environment.ts';
//   // Load node modules

//     const appVersion = require('../../package.json').version;
//     require('dotenv').config({
//       path: 'src/environments/.env'
//     });
//   // `environment.ts` file structure
//     const envConfigFile = `export const environment = {
//     googleKey: '${process.env.GOOGLE_KEY}',
//     apiKey: '${process.env.API_KEY}',
//     appVersion: '${appVersion}',
//     production: true,
//   };
//   `;
//     console.log('The file `environment.ts` will be written with the following content: \n');
//     writeFile(targetPath, envConfigFile, (err) => {
//       if (err) {
//         console.error(err);
//         throw err;
//       } else {
//         console.log(`Angular environment.ts file generated correctly at ${targetPath} \n`);
//       }
//     });
//   };
  
//   setEnv();

/* tslint:disable */
// @ts-nocheck
const { writeFile, existsSync, mkdirSync } = require('fs');
const { argv } = require('yargs');

require('dotenv').config();
const environment = argv.environment;
const appVersion = require('../../package.json').version;

function writeFileUsingFS(targetPath, environmentFileContent) {
  writeFile(targetPath, environmentFileContent, function (err) {
    if (err) {
      console.log(err);
    }
    if (environmentFileContent !== '') {
      console.log(`wrote variables to ${targetPath}`);
    }
  });
}


// Providing path to the `environments` directory
const envDirectory = 'src/environments';

// creates the `environments` directory if it does not exist
if (!existsSync(envDirectory)) {
  mkdirSync(envDirectory);
}

//creates the `environment.prod.ts` and `environment.ts` file if it does not exist
writeFileUsingFS('src/environments/environment.prod.ts', '');
writeFileUsingFS('src/environments/environment.ts', '');


// Checks whether command line argument of `prod` was provided signifying production mode
const isProduction = environment === 'prod';

// choose the correct targetPath based on the environment chosen
const targetPath = isProduction
  ? 'src/environments/environment.prod.ts'
  : 'src/environments/environment.ts';

//actual content to be compiled dynamically and pasted into respective environment files
    const environmentFileContent = `export const environment = {
    googleKey: '${process.env.GOOGLE_KEY}',
    apiKey: '${process.env.API_KEY}',
    appVersion: '${appVersion}',
    production: ${isProduction},
  };
  `;
console.log('target path:'+targetPath);
console.log('env:'+environment);
writeFileUsingFS(targetPath, environmentFileContent); // appending data into the target file

/* tslint:enable */