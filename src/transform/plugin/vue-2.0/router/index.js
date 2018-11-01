/**
 * Router template
 */
const template = function(routes) {
    return `
    /*global Vue*/
    import 'modules/base';
    import VueRouter from 'vue-router';
    import login from '@hfe/native-web-login';
    login.init();

    Vue.use(VueRouter);
    const router = new VueRouter({
        routes: ${routes}
    });

    /* eslint-disable no-new */
    const app = new Vue({
        router
    }).$mount('#app');
        `;
};

export default template;
