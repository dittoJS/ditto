import Transform from '../../src/index';
import MiniPlugin from '../../plugin/mini';
import AppComponent from './index';

const APP = new Transform(MiniPlugin);
APP.renderPage(AppComponent)