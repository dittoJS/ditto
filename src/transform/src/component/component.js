import compiler from '../compiler/compile.js';
import { jsToCss } from "../../src/utils/style";

export function composite (options = {}) {
    if (!options.name) {
        console.error('component\'s name is must');
    }
    let TAG = 'Component';
    return (
        <TAG is-component={true} name={options.name}/>
    )
}

let uid = 0;
export default class Component {
    constructor (options, transformOptions, host) {
        this.$name = options.name;
        this.$template = options.template;
        this.$host = host;
        this.$parent = null;
        this.$children = [];
        this.$result = {};
        this.$id = uid++;
        this.$options = options;
        this.$transformOptions = transformOptions;
        this.$isCustomComponent = false;
        this.init();
    }

    init () {
        this.parseChildren(this.$template);
        this.compileTemplate();
        this.$result.style = jsToCss(this.$options.style);
    }

    appendChild (child) {
        this.$children.push(child);
        child.$parent = this;
    }

    parseChildren (template) {
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

        function parseChild (temp) {
            if (temp.type === 'COMPONENT') {
                let cp = new Component(temp.props['v-ref'], self.$transformOptions, self.$host);
                self.appendChild(cp);
                self.$host.$componentObject[temp.props['v-ref'].name] = cp;
                cp.$isCustomComponent = true;
            }
        }
    }

    compileTemplate () {
        this.$result.template = compiler(this.$template, this.$host.$options);
    }
}