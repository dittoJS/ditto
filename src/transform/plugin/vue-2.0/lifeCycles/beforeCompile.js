import Config from '../config';

export default function beforeCompile (node) {
    textNode(node);
    createTagName(node);
}

/**
 * pre compile text node
 */
function textNode (node) {
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
function createTagName (node) {
    node.tagName = Config.tags[node.type.toLowerCase()];
    return node.tagName;
}