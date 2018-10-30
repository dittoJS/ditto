import { proccessComponent } from '../../src/utils/component';
import { objectToString, hyphenate, normalizeFn } from '../../src/utils/lang';
import { writeFile } from '../../src/utils/file';
import { removeSetData } from '../../src/utils/index';
import config from './config.js';
import proccessEventDir from './directives/v-on.js';
const fs = require('fs-extra');
const path = require('path');

export default {
    config: {},
    beforeCompile,
    directives: {
        'v-for': processForDir,
        'v-if': processIfDir,
        'v-else': processElseDir,
        bind: processBindDir,
        'v-on': proccessEventDir
    },
    events: {
        click: '@click',
        touchstart: '@touchstart'
    },
    generate: generate,
    processTag(tagName) {
        let tag = config.tags[tagName.toLowerCase()];
        return tag;
    },
    beforeInitComponent(options) {
        options.tagName = 'v-' + options.name;

        return options;
    }
};

function processForDir(desc) {
    let propStr =
        `v-for="(${desc.parseParams.itemName}, ${desc.parseParams.indexName}) in ${desc.parseParams.objName}"
                    ` + (desc.key ? `:key='${desc.key}' ` : '');

    return propStr;
}

function processIfDir(desc) {
    return `v-if='${desc.parseParams}'`;
}

function processElseDir(desc) {
    return `v-else='${desc.parseParams}'`;
}

function processBindDir(desc) {
    let attr = '';
    if (desc.name === 'className') {
        attr = `class='${desc.params}' `;
    } else {
        attr = desc.isDynamic ? `:${desc.name}='${desc.params}' ` : `${desc.name}="${desc.params}" `;
    }

    return attr;
}

function generate(filename, component, parsedCode) {
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

    generateComponent(componentFileName, parsedCode, component);
}

function generateComponent(filename, parsedCode, component) {
    let componentModel = component.$options;
    let arr = proccessComponent(componentModel);
    let componentName = componentModel.name;
    let isPage = false; // page also can use Component constructor component.$isCustomComponent;
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
                let fnName = config.lifecycles[el];
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

    _code = removeSetData(_code)
    let vueCode = `<template>\n${template}\n</template>
    <style>\n${style}\n</style>
    <script>\n${_code}\n</script>`;
    console.log(`generate ${filename}`);
    writeFile(filename, vueCode, true);

    return vueCode;
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

function beforeCompile(node) {
    if (node.type === 'TEXT') {
        if (node.props.text) {
            node.props.children = `{{${node.props.text}}}`;
            delete node.props.text;
        }
    }
}
