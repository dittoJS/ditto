const template = require('babel-template');

module.exports = function({ types: t }) {
    return {
        visitor: {
            ImportDeclaration (path, state) {
                //console.log('-import:- ');
                path.replaceWith(t.NullLiteral());
            },
            Identifier (path, state) {
                //console.log(path);
            }
        }
    };
};
