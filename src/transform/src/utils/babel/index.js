const template = require('babel-template');
const generate = require('babel-generator');
const t = require('babel-types');
const babylon = require('babylon');
const babel = require('@babel/core');
const setDataPlugin = require('./setData.js');
const removeIfBlockPlugin = require('./if.js');
import jsx from '@babel/plugin-syntax-jsx';

const testCode = `
import footer from './index.wechat.js';
export default {
    ready () {
        let self = this;
        this.name = 'ysf';
        self.count = 10;
        this.setData({
            statusMsg: 'I am ready.',
            names: {
                a: 1
            }
        })
    }
}
`;

// babylon.parse(testCode, {
//     sourceType: 'module',
//     plugins: [setDataPlugin]
// });

// let ret = babel.transform(testCode, {
//     plugins: [setDataPlugin]
// })
// console.log(ret.code)

export function removeSetData(code) {
    return babel.transform(code, {
        plugins: [setDataPlugin]
    }).code;
}

export function removeIfBlock(code) {
    return babel.transform(code, {
        plugins: [removeIfBlockPlugin, jsx]
    }).code;
}
