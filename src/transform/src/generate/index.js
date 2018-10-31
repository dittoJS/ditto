import { readDirRecursive, copy, warn } from '../utils/index';
import path from 'path';

export default function generate(entry, output, host) {
    let options = host.$options;
    let lifeCycles = options.lifeCycles;
    copy(entry, output);
    console.log('Ready to generate.');
    readDirRecursive(output, function(filename, parsedInfo) {
        let basename = path.basename(filename, '.js');
        let component = host.$componentObject[basename];
        if (component) {
            let generate = lifeCycles.generate;
            generate && generate(filename, component, parsedInfo);
        } else {
            warn(`Component ${basename} is not exsit.`);
            warn(`${filename} is not exsit.`);
        }
    });
}

