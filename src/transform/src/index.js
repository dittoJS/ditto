import Transform from './transform';
import MiniPlugin from '../plugin/mini/mini';
import Vue2Plugin from '../plugin/vue-2.0/index';

const Ditto = {
    _plugins: {},
    createCompiler (name) {
        let _plugin = Ditto._plugins[name];
        if (_plugin) {
            return new Transform(_plugin);
        }
    },
    addPlugin (name, plugin) {
        Ditto._plugins[name] = plugin;
    },
    removePlugin (name) {
        delete Ditto._plugins[name];
    }
};

// default plugins
Ditto.addPlugin('vue2', Vue2Plugin);
Ditto.addPlugin('wechat', MiniPlugin);

export default Ditto;