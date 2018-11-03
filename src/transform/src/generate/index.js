import { readDirRecursive, copy, warn, parseFiles } from '../utils/index';
import path from 'path';
import fs from 'fs-extra';

export default function generate(fileInfoArray = [], host) {
    let options = host.$options;
    let pluginName = host.$name;
    let lifeCycles = options.lifeCycles;

    console.log('On generating.');

    fileInfoArray.forEach((fileInfo) => {
        parseFiles(fileInfo, function (filename, parsedInfo) {
            let basename = path.basename(filename, '.js');
            let component = host.$componentObject[basename];

            if (component) {
                let generate = lifeCycles.generate;
                fs.removeSync(filename);
                generate && generate(filename, component, parsedInfo);
            } else {
                warn(`Component ${basename} is not exsit.`);
                warn(`${filename} is not exsit.`);
            }
        });
    });
}
