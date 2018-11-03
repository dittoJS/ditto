import { readDirFiles, removeRequire } from '../utils/index';
import fs from 'fs-extra';
const path = require('path');

export function beforeGenerate(params) {
    let compilerFiles = [],
        compilerFileObject = {},
        platform = this.$name,
        plugins = this.$host._plugins,
        entry = params.entry,
        output = params.output;

    let fnRE = function(platform) {
        return new RegExp(`\\.${platform}\\.`);
    };

    let platformDir = path.join(entry, platform);
    readDirFiles(entry, function(filename) {
        let flag = false;
        Object.keys(plugins).forEach(function(pluginName, i) {
            if (filename.match(fnRE(pluginName)) || filename.indexOf(path.join(entry, pluginName)) !== -1) {
                compilerFileObject[pluginName] = compilerFileObject[pluginName] || [];
                compilerFileObject[pluginName].push(filename);
                flag = true;
            }
        });

        if (!flag) {
            compilerFiles.push(filename);
        }
    });

    // copy files to output directory
    let platforms = Object.keys(plugins);
    compilerFiles.concat(compilerFileObject[platform]).forEach(file => {
        let outName = file.replace(entry, output);
        fs.ensureFileSync(outName);

        let content = fs.readFileSync(file, 'utf8');

        platforms.forEach(type => {
            if (type !== platform) {
                // remove other platform code
                let _re = new RegExp(`\\n\.+\/${type}\/\.*`, 'g');
                if (content.match(_re)) {
                    console.log('match----------');
                }
                content = content.replace(_re, '');
            }
        });

        fs.writeFileSync(outName, content);
    });

    let testCode = `
        const name = require('./name.js')
    `;

    //console.log(removeRequire(testCode));
}
