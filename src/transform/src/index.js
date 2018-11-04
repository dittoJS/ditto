import Transform from './transform';
import MiniPlugin from '../plugin/mini/mini';
import Vue2Plugin from '../plugin/vue-2.0/index';
import WeChatPlugin from '../plugin/wechat/index';
import utils from '../src/utils';

const Ditto = {
    _plugins: {},
    createCompiler(name) {
        let _plugin = Ditto._plugins[name];
        if (_plugin) {
            return new Transform(name, _plugin, Ditto);
        }
    },
    addPlugin(name, plugin) {
        Ditto._plugins[name] = plugin;
    },
    removePlugin(name) {
        delete Ditto._plugins[name];
    },
    createPlugin(pluginCreator) {
        if (pluginCreator) {
            return pluginCreator(utils);
        }
    },
    run (options = {}) {
        let _plugins = options.plugins || [];
        _plugins.forEach(plugin => {
            if (typeof plugin === 'string') {
                this._plugins[plugin].compile(options.config);
            }
        });
    }
};

// default plugins
Ditto.addPlugin('vue2', Vue2Plugin);
Ditto.addPlugin('wechat', WeChatPlugin);

export default Ditto;
