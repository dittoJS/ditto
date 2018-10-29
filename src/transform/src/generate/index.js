import { readDirRecursive, copy } from '../utils/file';
import path from 'path';

export default function generate (entry, output, host) {
    let options = host.$options;
    beforeGenerate();
    copy(entry, output);
    console.log('copy files');
    readDirRecursive(output, function (filename, parsedCode) {
        let basename = path.basename(filename, '.js');
        let component = host.$componentObject[basename];
        if (component) {
            options.generate && options.generate(filename, component, parsedCode);
        } else {
            console.warn(`component ${filename} is not exsit.`)
        }
    })
}

function beforeGenerate () {
    console.log('begin generate');
}