const fs = require("fs-extra");
const path = require('path');
import { warn } from './debug';
// import { codePrettier } from './lang';

const componentFileRE = /\/\*\s*\@component\s*\*\//;        // /* component */
const refOfComponentRE = /\/\*\s*\@import\s*\*\/\s*\n((.+\n)+)\n+/;          // /* @import */

export function writeFile (file, content, isPretter = false) {
    fs.ensureFile(file, err => {
        if (err) console.log(err);

        fs.outputFile(file, content, err => {
            if (err) {
                console.log(err);
            }
        })
    })
}

export function readDirRecursive (dirname, cb) {
    // console.log('dirname: ', dirname);
    fs.readdir(dirname, 'utf8', function (err, files) {
        if (err) {
            console.log(err);
            return false;
        };
        files.forEach(file => {
            let filename = path.join(dirname, file);
            // console.log('filename: ', filename)
            if (fs.statSync(filename).isFile()) {
                let content = isComponentFile(filename);
                if (!content) {
                    // warn(`Invalid component: ${filename}`);
                    return false;
                }

                /**
                 * process for the require of chilren components and styles
                 */
                let componentLink = '';
                let componentRemoveLink = content.replace(refOfComponentRE, function (match) {
                    componentLink = match;
                    return '\n';
                });
                content = componentRemoveLink;
                let codeArray = content.split(componentFileRE);
                let commonCode = codeArray[0];
                let componentCode = codeArray[1];
                let refs = [];
                componentLink.split('\n').forEach((item, index) => {
                    if (index !== 0 && item) {
                        refs.push(item);
                    }
                })

                if (codeArray.length !== 2) {
                    warn(`Missing @component identify.`);
                } else {
                    cb && cb(filename, {
                        commonCode, 
                        componentCode,
                        refs,
                        content
                    });
                }
            } else {
                readDirRecursive(filename, cb);
            }
        });
    });
    
}

export function copy (from, to) {
    if (!from) {
        warn('Missing entry path.');
        return false;
    }

    if (!to) {
        warn('Missing dist path.');
        return false;
    }
    fs.ensureDirSync(to);
    fs.copySync(from, to)
}

function isComponentFile (filename) {
    let code = fs.readFileSync(filename, 'utf8');

    if (code.match(componentFileRE)) {
        return code;
    } else {
        return false;
    }
} 
