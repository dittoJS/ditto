export default function beforeCreate (componentOptions, pluginOptions) {
    componentOptions.tagName = 'v-' + componentOptions.name;

    return componentOptions;
}
