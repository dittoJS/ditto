import compiler from '../compiler/compile.js';
import { jsToCss } from '../../src/utils/style';
import { deepCopy } from '../../src/utils/lang';

export function composite(options = {}) {
    if (!options.name) {
        console.error("component's name is must");
    }
    let TAG = 'Component';
    return <TAG is-component={true} name={options.name} />;
}

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
        if (transformOptions.beforeInitComponent) {
            options = transformOptions.beforeInitComponent(options);
        }
        if (!options.name) {
            console.error('component must have an name.');
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
        let children = template.props.children;
        let self = this;
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
            if (temp.type === 'COMPONENT') {
                let cp = new Component(temp.props['v-ref'], self.$transformOptions, self.$host);
                self.appendChild(cp);
                // self.$host.$componentObject[temp.props['v-ref'].name] = cp;
                cp.$isCustomComponent = true;
                self.parseChildren(temp.props['v-ref'].template);
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
