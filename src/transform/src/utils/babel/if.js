const template = require('babel-template');
/** 
 let testCode = `
    if (_compile_platform === 'wechat') {
        console.log('a')
    } else {

    }
`;

result:
    console.log('a');
*/
module.exports = function({ types: t }) {
    return {
        visitor: {
            IfStatement(path, state) {
                let name, value;
                let _compile_platform = process.env._compile_platform;
                let right = path.node.test.right;
                let left = path.node.test.left;

                if (left.type === 'Identifier') {
                    name = left.name;
                    value = right.value;
                } else {
                    name = right.name;
                    value = left.value;
                }

                if (name === '_compile_platform') {
                    if (_compile_platform === value) {
                        path.replaceWithMultiple(path.node.consequent.body);
                    } else {
                        path.replaceWithMultiple(path.node.alternate.body);
                    }
                } else {
                    return false;
                }                
            }
        }
    };
};
