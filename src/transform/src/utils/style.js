import { hyphenate } from './lang';

export const StyleSheet = {
    create (obj = {}) {
        return obj;
    }
};

export function jsToCss (style) {
    if (!style) return '';

    let _style = '';
    Object.keys(style).forEach((attr) => {
        let items = style[attr];
        _style += `.${attr} {\n`;
        Object.keys(items).forEach((item) => {
            _style += `    ${hyphenate(item)}: ${items[item]};\n`;
        });
        _style += `}\n`
    })

    return _style;
}