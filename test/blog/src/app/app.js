// import wechat from '../common/index.wechat';

/* @import */
import Footer from '../components/footer/footer';
import template from './app.tpl.js';
import Style from './app.style.js';


const hotel = 'ssss';
/* @component */

export default {
  name: 'app',
  style: Style,
  template: template(Footer),
  props: {},
  data: {
    hi: 'hello world!',
    statusMsg: 'Not ready!',
    items: [1, 2, 3, 4]
  },
  methods: {
    onShowMessage() {
      console.log('wellcome to here!');
    }

  },

  ready() {
    this.setData({
      statusMsg: 'I am ready.'
    });
  }

};