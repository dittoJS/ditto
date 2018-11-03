import { removeSetData, proccessComponent, objectToString, hyphenate, normalizeFn, writeFile } from '../../../src/utils/index';
import Config from '../config';
import routerFile from '../router/index.js';
const fs = require('fs-extra');
const path = require('path');

export default function generate(filename, component, parsedCode) {
    let opts = parsedCode.options;

    if (opts.type === 'router') {
        generateRouter(filename, component, parsedCode, opts);
        return true;
    }

    let dirname = path.dirname(filename);
    let basename = path.basename(filename, '.js');
    let templateFileName = path.join(dirname, basename + '.wxml');
    let componentFileName = path.join(dirname, basename + '.js');
    let styleFileName = path.join(dirname, basename + '.wxss');
    let configFileName = path.join(dirname, basename + '.json');

    // remove origin tpl and style files
    let tpl = path.join(dirname, basename + '.tpl.js');
    let style = path.join(dirname, basename + '.style.js');
    fs.remove(tpl);
    fs.remove(style);

    generateTemplete(templateFileName, component.$result.template);
    generateStyle(styleFileName, component.$result.style);
    generateComponent(componentFileName, parsedCode, component);
    generateJson(configFileName, component, parsedCode);
}

function generateComponent(filename, parsedCode, component) {
    let componentModel = component.$options;
    let arr = proccessComponent(componentModel, Config);
    let componentName = componentModel.name;
    let isPage = false; // page also can use Component constructor component.$isCustomComponent;
    let tag = isPage ? 'Page' : 'Component';
    let commonCode = parsedCode.commonCode;
    let _code = '';
    _code += commonCode;
    _code += `\n${tag}({`;

    arr.forEach(element => {
        if (isPage && element.type === 'props') {
            _code += 'properties:';
            _code += objectToString(element.body);
            _code += ',';
        } else if (element.type === 'data') {
            let _data = typeof element.body === 'object' ? element.body : element.body();
            _code += '\ndata: ';
            _code += objectToString(_data);
        } else if (element.type === 'methods') {
            Object.keys(element.body).forEach(el => {
                _code += ',\n';
                _code += element.body[el].toString();
            });
        } else if (element.type === 'lifecycles') {
            Object.keys(element.body).forEach(el => {
                _code += ',\n';
                _code += element.body[el].toString();
            });
        }
    });
    _code += '});';
    console.log(`generate ${filename}`);
    writeFile(filename, _code, true);
    return _code;
}

function generateTemplete(filename, template) {
    writeFile(filename, template);
}

function generateStyle(filename, style) {
    if (style) {
        writeFile(filename, style);
    }
}

function generateJson(filename, component, parsedCode = []) {
    let subComponents = parseSubComponentPath(parsedCode.imports);

    let subComponentsStr = '';
    subComponents.forEach(component => {
        subComponentsStr += `,\n"${component.name}": "${component.path}"`;
    });

    let config = `{
        "component": "true",
        "usingComponents": {
            ${subComponentsStr.substr(1)}
            }
        }`;

    writeFile(filename, config);
}

function parseSubComponentPath(arr) {
    let subComponents = [];
    let filenameRE = /[\'|\"](.+)[\'|\"]/;
    arr.forEach(item => {
        let matchs, componentName, filename;
        if ((matchs = item.match(filenameRE))) {
            filename = matchs[1];
            if (!filename.match(/(\.tpl)|(\.style)/)) {
                let componentName = path.basename(filename, '.js');
                filename = path.dirname(filename);
                subComponents.push({
                    name: hyphenate(componentName),
                    path: filename + '/' + componentName
                });
            }
        }
    });

    return subComponents;
}

function generateRouter(filename, component, parsedCode, options) {
    let componentModel = component.$options;
    let arr = proccessComponent(componentModel, Config);
    let componentName = componentModel.name;
    let subComponents = parseSubComponentPath(parsedCode.imports);

    let dirname = path.dirname(filename);
    let basename = path.basename(filename, '.js');
    let templateFileName = path.join(dirname, basename + '.wxml');
    let jsonFileName = path.join(dirname, basename + '.json');
    fs.remove(filename);
    generateJson(jsonFileName, component, parsedCode);
    generateTemplete(templateFileName, component.$result.template);
    writeFile(filename, routerFile.template);
}
