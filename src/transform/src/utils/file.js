const fs = require('fs-extra');
const path = require('path');
import { warn } from './debug';
// import { codePrettier } from './lang';
import { removeIfBlock } from './babel/index';

let componentFileRE = /\/\*\s*\@component\s*\*\//; // /* component */
let routerFileRE = /\/\*\s*\@router\s*\*\//; // /* Router */
let importsOfComponentRE = /\/\*\s*\@import\s*\*\/\s*\n*((.+\n)+)\n+/; // /* @import */

export function writeFile(file, content, isPretter = false) {
    fs.ensureFileSync(file);
    fs.outputFileSync(file, content);
}

/**
 * called after parsed file info
 * @param {*} filename
 * @param {*} code
 */
export function removeOtherPlatformCode(filename, code) {
    if (filename.indexOf('.js') !== -1) {
        code = removeIfBlock(code);
    }

    return code;
}

/**
 * read file and parse component files
 * @param {*} dirname
 * @param {*} cb
 */
export function parseFiles(obj = {}, cb) {
    let filename = obj.filename;
    let content = obj.content;
    let _RE = componentFileRE;
    let options = {
        type: 'component'
    };

    if (!isComponentFile(content)) {
        // warn(`Invalid component: ${filename}`);
        if (isRouterFile(content)) {
            _RE = routerFileRE;
            options.type = 'router';
        } else {
            removeOtherPlatformCode(filename, content);
            return false;
        }
    }

    /**
     * process for the require of chilren components and styles
     */
    let componentLink = '';
    let componentRemoveLink = content.replace(importsOfComponentRE, function(match) {
        componentLink = match;
        return '\n';
    });
    content = componentRemoveLink;
    let codeArray = content.split(_RE);
    let commonCode = codeArray[0];
    let componentCode = codeArray[1];
    let refs = [];
    componentLink.split('\n').forEach((item, index) => {
        if (index !== 0 && item) {
            refs.push(item);
        }
    });

    if (codeArray.length !== 2) {
        warn(`Missing @component identify.`);
    } else {
        cb &&
            cb(filename, {
                commonCode: removeOtherPlatformCode(filename, commonCode),
                componentCode: removeOtherPlatformCode(filename, componentCode),
                imports: refs,
                options,
                content
            });
    }
}

export function readDirFiles(dirname, cb) {
    let files = fs.readdirSync(dirname, 'utf8');
    if (files) {
        files.forEach(file => {
            let filename = path.join(dirname, file);
            if (fs.statSync(filename).isFile()) {
                cb && cb(filename);
            } else {
                readDirFiles(filename, cb);
            }
        });
    }
}

export function copy(from, to) {
    if (!from) {
        warn('Missing entry path.');
        return false;
    }

    if (!to) {
        warn('Missing dist path.');
        return false;
    }
    fs.ensureDirSync(to);
    fs.copySync(from, to);
}

function isComponentFile(code) {
    if (code.match(componentFileRE)) {
        return code;
    } else {
        return false;
    }
}

function isRouterFile(code) {
    if (code.match(routerFileRE)) {
        return code;
    } else {
        return false;
    }
}
