import wechatIndex from './wechat/index';
/* @import */
import AppComponent from './src/app/app';

/* @component */

const template = (
    <View className="wrapper">
        <View className="container" />
        <Child component={AppComponent} />
    </View>
);

export default {
    name: 'index',
    template,

    mounted() {
        console.log('init blog home page.');

        if (_compile_platform === 'wechat') {
          console.log('i am wechat')
        } else {
          console.log('i am vue')
        }
    }
};
