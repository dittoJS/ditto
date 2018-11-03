import Component from './component/component';
import generate from './generate/index';
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
    constructor (name, options) {
        this.$root = null;
        this.$config = null;
        this.$options = options;
        this.$name = name;
        this.$uid = uid++;
        this.$componentObject = {};

        this._currentComponent = null;
    }
    

    init () {
    }

    renderPage (app) {
        // node_env
        process.env.platform = this.$name;
        this.$root = new Component(app, this.$options, this);
        return this;
    }

    setHtml (_html) {
        this.$options.html = _html;
    }

    traverse () {

    }

    beforeCompile () {

    }

    generate (entry, output) {
        // let entry = this.$options.entry;
        // let output = this.$options.output;
        generate(entry, output, this);
        return this;
    }
}
