import { parseForDir } from '../parse/index';
import defaultDirectives from '../directive/index';
import { warn } from '../utils/index';

const bindRE = /^([a-z]|[A-Z])+/;
const onRE = /^on-(\w+)/;
const dirAttrRE = /^v-(\w+)/;

let options;
export default function compiler(ast, opt = {}) {
    options = opt;
    return compileNode(ast);
}

function toLowerCase(str) {
    return str.toLowerCase();
}

function compileNode(node, parentNode) {
    let template = '';
    let deep = typeof options.deep === 'undefined' ? true : false;
    let middlewareFn = options.directives['v-bind'] || processProp;
    let directives = Object.assign(defaultDirectives, options.directives);
    let processTag = options.processTag || toLowerCase;
    let compileNodeText = compileNodeTextBuilder(options);
    let nodeTemplate = '';

    if (options.lifeCycles.beforeCompile) {
        options.lifeCycles.beforeCompile(node);
    }

    let tagName = node.tagName;

    // default process for tagName
    if (!tagName) {
        node.tagName = processTag(node.type);
        beforeCompile(node);
        tagName = node.tagName;
    }

    let props = node.props || {};
    nodeTemplate += `<${tagName} `;
    Object.keys(props).forEach(item => {
        let matchs,
            attr = {};
        if (item === 'children') return false;
        if (node.type === 'CHILD' && item === 'component') return false;
        // terminal dir
        if ((matchs = item.match(dirAttrRE))) {
            let dirParams;
            if (matchs[1] === 'for') {
                dirParams = parseForDir(props[item]);
            } else if (matchs[1] === 'if') {
                dirParams = props[item];
            } else if (matchs[1] === 'else') {
                dirParams = props[item];
            }
            let dir = {
                name: matchs[1],
                rawName: item,
                parseParams: dirParams,
                params: props[item],
                key: node.key,
                tagName
            };

            attr = {
                type: 'terminal',
                desc: dir
            };
        } else if ((matchs = item.match(onRE))) {
            let eventType = options.events.typeMap[matchs[1]];
            eventType = eventType || matchs[1];
            attr = {
                type: 'terminal',
                desc: {
                    name: eventType,
                    rawName: 'v-on',
                    params: props[item],
                    isDynamic: true
                }
            };
        } else if (item.match(bindRE)) {
            let params, isDynamic;
            params = props[item];

            if (params[0] === '"' || params[0] === "'") {
                isDynamic = false;
                params = params.replace(/\"/g, "'");
            } else {
                isDynamic = true;
            }

            attr = {
                type: 'bind',
                desc: {
                    name: item,
                    rawName: item,
                    params,
                    isDynamic,
                    tagName
                }
            };
        }

        let ret;
        if (directives && directives[attr.desc.rawName]) {
            ret = directives[attr.desc.rawName](attr.desc, node, parentNode);
        } else {
            ret = middlewareFn(attr.desc, node);
        }

        if (typeof ret === 'string') {
            nodeTemplate += ret;
        }
    });

    template += nodeTemplate;

    if (deep && typeof props.children !== 'string') {
        if (props.children) {
            template += '>';
            template += compileNodeList(node);
            template += `</${tagName}>`;
        } else {
            template += '/>';
        }
    } else {
        if (typeof props.children === 'string') {
            template += '>';
            template += `${compileNodeText(node)}</${tagName}>`;
        } else {
            template += `/>`;
        }
    }

    return template;
}

function compileNodeList(node) {
    let children = node.props.children;
    let template = '';
    if (Array.isArray(children)) {
        children.forEach(child => {
            template += compileNode(child, node);
        });
    } else {
        template += compileNode(children, node);
    }

    return template;
}

function compileNodeTextBuilder(options = {}) {
    let processText =
        options.processText ||
        function(str) {
            return str;
        };

    return function compileNodeText(node) {
        return processText(node.props.children);
    };
}

function processProp(desc, node) {
    return `${desc.name}='${desc.params}' `;
}

function beforeCompile(node) {
    if (node.type === 'CHILD') {
        let child = node.props.component;
        node.tagName = child.name;
    }
}
