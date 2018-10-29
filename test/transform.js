import { Transform, MiniPlugin } from '../src/transform/src/index';
const path = require('path');
import AppComponent from './blog/index.js';
const App = new Transform(MiniPlugin);

let output = "/Users/yangxiaofu/work/2018/meituan/开源项目/小程序/pages/blog";
App
    .renderPage(AppComponent)
    //generate(path.resolve(__dirname, '../test/blog'), path.resolve(__dirname, '../output'));
    .generate('./test/blog', output)