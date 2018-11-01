import { hyphenate } from './lang';

export const StyleSheet = {
    create(obj = {}) {
        return obj;
    }
};

export function jsToCss(style, styleOptions) {
    if (!style) return '';

    let cb =
        styleOptions.beforeCompile ||
        function(val, key) {
            return { 
                    value: val,
                    key
                };
        };
    let _style = '';
    Object.keys(style).forEach(attr => {
        let items = style[attr];
        _style += `.${hyphenate(attr)} {\n`;
        Object.keys(items).forEach(item => {
            let obj = cb(items[item], item);
            let value = obj.value;
            let key = obj.key;
            _style += `    ${hyphenate(item)}: ${value};\n`;
        });
        _style += `}\n`;
    });

    return _style;
}
