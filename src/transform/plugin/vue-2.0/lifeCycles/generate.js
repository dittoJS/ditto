import { removeSetData, proccessComponent, objectToString, hyphenate, normalizeFn, writeFile, transformFn, firstWordToUp } from '../../../src/utils/index';
import routerTemplateFn from '../router/index';
import Config from '../config';

const fs = require('fs-extra');
const path = require('path');

export default function generate(filename, component, parsedInfo) {
    let opts = parsedInfo.options;
    if (opts.type === 'router') {
        generateRouter(filename, component, parsedInfo, opts);
        return true;
    }

    let dirname = path.dirname(filename);
    let basename = path.basename(filename, '.js');
    let componentFileName = path.join(dirname, basename + '.vue');

    // remove origin tpl and style files
    let tpl = path.join(dirname, basename + '.tpl.js');
    let style = path.join(dirname, basename + '.style.js');
    let js = path.join(dirname, basename + '.js');
    fs.remove(tpl);
    fs.remove(style);
    fs.remove(js);

    generateComponent(componentFileName, parsedInfo, component);
}

function generateComponent(filename, parsedCode, component) {
    let componentModel = component.$options;
    let arr = proccessComponent(componentModel, Config);
    let componentName = componentModel.name;
    let isPage = false; // page also can use Component constructor. component.$isCustomComponent;
    let tag = isPage ? 'Page' : 'Component';
    let commonCode = parsedCode.commonCode;
    let subComponents = parseSubComponentPath(parsedCode.refs);
    let template = component.$result.template;
    let style = component.$result.style;
    let _code = '';
    _code += commonCode;

    // sub component import
    subComponents.forEach(item => {
        _code += `import ${item.name} from '${item.path}';\n`;
    });

    _code += `\nexport default {\n`;

    arr.forEach(element => {
        if (isPage && element.type === 'props') {
            _code += 'props:';
            _code += objectToString(element.body);
            _code += ',';
        } else if (element.type === 'data') {
            let _data = element.body,
                fn;
            if (typeof _data !== 'function') {
                fn = new Function(`return ${objectToString(_data)};`);
            } else {
                fn = _data;
            }
            _code += '\ndata: ';
            _code += fn.toString() + ',\n';
        } else if (element.type === 'methods') {
            _code += `methods: {\n`;
            Object.keys(element.body).forEach(fnName => {
                _code += `  ${fnName}: `;
                _code += normalizeFn(element.body[fnName].toString());
                _code += ',';
            });
            _code += '}\n,';
        } else if (element.type === 'lifecycles') {
            Object.keys(element.body).forEach(el => {
                let fn = element.body[el];
                let fnName = Config.lifeCycles[el];
                if (fnName) {
                    _code += `\n${fnName}: `;
                    _code += normalizeFn(fn.toString());
                } else {
                    _code += ',\n';
                    _code += fn.toString();
                }
            });
        }
    });

    // subcomponents
    if (subComponents && subComponents.length) {
        _code += ',\n';
        _code += 'components: {\n';
        subComponents.forEach(item => {
            _code += `  "v-${item.name}": ${item.name},`;
        });
        _code += '\n}';
    }
    _code += '};';
    _code = transformFn(_code);
    _code = removeSetData(_code);
    let vueCode = `<template>\n${template}\n</template>
    <style>\n${style}\n</style>
    <script>\n${_code}\n</script>`;
    console.log(`generate ${filename}`);
    writeFile(filename, vueCode, true);

    return vueCode;
}

function parseSubComponentPath(arr) {
    if (!arr) return [];
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
    let componentName = componentModel.name;
    let subComponents = parseSubComponentPath(parsedCode.imports);

    let dirname = path.dirname(filename);
    let basename = path.basename(filename, '.js');
    fs.remove(filename);
    let code = ``;
    let routes = component.$routes;
    let htmlTemplate = component.$host.$options.html;
    subComponents.forEach((child) => {
        code += `import ${firstWordToUp(child.name)} from '${child.path}';\n`;
    });
    let routerTemplate = '';
    routerTemplate += `[\n`;
    routes.forEach(route => {
        routerTemplate += `{
            path: '${route.path}',
            component: ${route.name}
        },\n`;
    });
    routerTemplate += `]`;
    writeFile(filename, code + routerTemplateFn(routerTemplate));
    writeFile(
        path.join(dirname, 'index.html'),
        htmlTemplate
    );
}
