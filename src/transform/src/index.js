import Component from './component/component';
import generate from './generate/index';
import React from 'react';
import MiniPlugin from '../plugin/mini';

global = Object.assign(global, {
    React,
    View: 'VIEW',
    Text: 'TEXT',
    Component: 'COMPONENT'
});

class Transform {
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
        this.$componentObject[app.name] = this.$root;
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

export {
    MiniPlugin,
    Transform
}