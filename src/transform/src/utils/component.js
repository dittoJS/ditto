import config from '../../config';

export function proccessComponent (options={}) {
    /**
     @props
     @data
     @computed
     @methods
     @lifecycles
     */
    let arr = [];
    options.data = options.data || {};
    _attr('props');
    _attr('data');
    _attr('computed');
    _attr('methods');

    let lifecycles = {};
    config.lifecycles.forEach((item) => {
        if (options[item]) {
            lifecycles[item] = options[item];
        }
    })

    arr.push({
        type: 'lifecycles',
        body: lifecycles
    });

    return arr;

    function _attr (attrName) {
        if (options[attrName]) {
            arr.push({
                type: attrName,
                body: Object.assign({}, options[attrName])
            });
        }
    }
}