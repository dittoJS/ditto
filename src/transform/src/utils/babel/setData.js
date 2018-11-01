const template = require('babel-template');

module.exports = function({ types: t }) {
    return {
        visitor: {
            CallExpression(path, state) {
                let builder = t.AssignmentExpression;
                let callee = path.node.callee;
                let args = path.node.arguments;
                if (callee || (callee.property && callee.property.name === 'setData')) {
                    let fnName = callee.property.name;
                    let objs = args[0].properties;
                    let _obj = {};
                    let code = '';
                    let astArr = [];
                    let context = 'this';
                    // let buildAssign = template(`
                    //     NAME['KEY'] = VALUE;
                    // `);
                    // const ast = buildAssign({
                    //     NAME: t.
                    // });
                    // console.log(objs)
                    objs && objs.forEach(el => {
                        //_obj[el.key.name] = el.value.value;
                        //code += `
                        //${context}['${el.key.name}'] = ${el.value.value};
                        //`;
                        let _ast = {
                            type: 'MemberExpression',
                            object: callee.object,
                            property: null
                        };
                        _ast.property = builder('=', el.key, el.value);
                        astArr.push(_ast);
                    });

                    context = 'this';
                    if (callee.object.type === 'Identifier') {
                        context = callee.object.name;
                    }

                    path.replaceWithMultiple(astArr);
                } else {
                    return false;
                }
            }
        }
    };
};
