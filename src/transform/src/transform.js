import Component from './component/component';
import generate from './generate/index';
import { beforeGenerate } from './generate/beforeGenerate';
import React from 'react';
import Config from '../config'

global = Object.assign(global, {
    React,
    View: 'VIEW',
    Text: 'TEXT',
    Image: 'IMAGE',
    Button: 'BUTTON',
    TextInput: 'TEXTINPUT',
    Link: 'LINK',
    Component: 'COMPONENT',
    Child: 'CHILD'
}, Config.global, Config.commonTag);

let uid = 0;
export default class Transform {
    constructor (name, options, host) {
        this.$root = null;
        this.$config = {};
        this.$compiler = {};
        this.$options = options;
        this.$name = name;
        this.$uid = uid++;
        this.$componentObject = {};
        this.$host = host;

        this._currentComponent = null;
    }
    

    init () {
    }

    renderPage (app) {
        // node_env
        process.env._compile_platform = this.$name;
        this.$root = new Component(app, this.$options, this);
        return this;
    }

    setHtml (_html) {
        this.$options.html = _html;
    }

    traverse () {

    }

    compile (opts = {}) {
        this.renderPage(opts.app);
        this.generate(opts.entry, opts.output);
    }

    generate (entry, output) {
        let fileInfoArray = beforeGenerate.call(this, {entry, output})
        generate(fileInfoArray, this);
        return this;
    }
}
