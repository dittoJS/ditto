/* @import */
import AppComponent from './src/app/app';

/* @component */
const template = (
  <View className="wrapper">
    <View className="container">
      <Component v-ref={AppComponent}/>
    </View>
  </View>
);

export default {
    name: 'index',
    template,
    ready () {
        console.log('init blog home page.');
    }
};
