import Config from '../config';

export default function beforeCompile(node) {
    textNode(node);
    createTagName(node);
    processRouter(node);

    return node;
}

/**
 * pre compile text node
 */
function textNode(node) {
    if (node.type === 'TEXT') {
        if (node.props.text) {
            node.props.children = `{{${node.props.text}}}`;
            delete node.props.text;
        }
    }
}

/**
 * add a tagName for the given Node
 */
function createTagName(node) {
    node.tagName = node.tagName || Config.tags[node.type.toLowerCase()];
    return node.tagName;
}

/**
 * process for router view
 */
function processRouter(node) {
    if (node.type === 'ROUTE') {
        let childNode = node.props.component;
        node.tagName = childNode.name;
        let pathName = node.props.path;
        node.props['v-if'] = 'path === ' + '"' + pathName + '"';
        delete node.props.component;
        delete node.props.path;
    }
}
