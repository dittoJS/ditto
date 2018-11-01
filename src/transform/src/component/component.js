import compiler from '../compiler/compile.js';
import { jsToCss, deepCopy } from '../../src/utils/index';

let uid = 0;
export default class Component {
    constructor(options, transformOptions, host) {
        this.beforeInit(options, transformOptions);
        this.$name = options.name;
        this.$template = deepCopy(options.template);
        this.$host = host;
        this.$parent = null;
        this.$children = [];
        this.$result = {};
        this.$id = uid++;
        this.$options = options;
        this.$transformOptions = transformOptions;
        this.$isCustomComponent = true;
        this.$host.$componentObject[options.name] = this;
        this.init();
    }

    beforeInit(options, transformOptions) {
        if (transformOptions.components.beforeCreate) {
            transformOptions.components.beforeCreate(options);
        }
        if (!options.name) {
            console.error('Component must have an name.');
        }
    }

    init() {
        this.parseChildren(this.$template);
        this.compileTemplate();
        this.$result.style = jsToCss(this.$options.style, this.$transformOptions.style || {});
    }

    appendChild(child) {
        this.$children.push(child);
        child.$parent = this;
    }

    parseChildren(template) {
        let self = this;
        if (template.type === 'CHILD') {
            parseChild(template);
        }
        let children = template.props.children;
        if (!children || typeof children === 'string') {
            return false;
        }

        if (Array.isArray(children)) {
            children.forEach(element => {
                this.parseChildren(element);
            });
        } else {
            parseChild(children);
        }

        function parseChild(temp) {
            if (temp.type === 'CHILD') {
                let child = temp.props['component'];
                let cp = new Component(child, self.$transformOptions, self.$host);
                self.appendChild(cp);
                cp.$isCustomComponent = true;
                self.parseChildren(child.template);
            } else if (temp.type === 'ROUTE') {
                let cp = new Component(temp.props['component'], self.$transformOptions, self.$host);
                self.appendChild(cp);
                cp.$isCustomComponent = true;
                self.parseChildren(temp.props['component'].template);
            }

            if (temp.props && temp.props.children) {
                self.parseChildren(temp);
            }
        }
    }

    compileTemplate() {
        this.$result.template = compiler(this.$template, this.$host.$options);
    }
}
