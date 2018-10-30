import Component from './component/component';
import generate from './generate/index';
import React from 'react';

global = Object.assign(global, {
    React,
    View: 'VIEW',
    Text: 'TEXT',
    Image: 'IMAGE',
    Button: 'BUTTON',
    TextInput: 'TEXTINPUT',
    Link: 'LINK',
    Component: 'COMPONENT'
});

export default class Transform {
    constructor (options) {
        this.$root = null;
        this.$config = null;
        this.$options = options;
        this.$componentObject = {};

        this._currentComponent = null;
    }
    

    init () {
    }

    renderPage (app) {
        this.$root = new Component(app, this.$options, this);
        return this;
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
