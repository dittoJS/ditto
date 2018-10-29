export function proccessComponent (options={}) {
    /**
     @props
     @data
     @computed
     @methods
     @lifecycles
     */
    let arr = [];
    _attr('props');
    _attr('data');
    _attr('computed');
    _attr('methods');

    let lifecycles = {
        ready: options.ready
    }

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