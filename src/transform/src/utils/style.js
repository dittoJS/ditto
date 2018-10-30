import { hyphenate } from './lang';

export const StyleSheet = {
    create (obj = {}) {
        return obj;
    }
};

export function jsToCss (style, styleOptions) {
    if (!style) return '';

    let cb = styleOptions.beforeCompile || function (val) { return val; };
    let _style = '';
    Object.keys(style).forEach((attr) => {
        let items = style[attr];
        _style += `.${attr} {\n`;
        Object.keys(items).forEach((item) => {
            let attr = cb(items[item]);
            _style += `    ${hyphenate(item)}: ${attr};\n`;
        });
        _style += `}\n`
    })

    return _style;
}