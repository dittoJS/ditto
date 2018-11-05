> This project is currently in beta and APIs are subject to change.

# [Ditto](https://dittojs.github.io/documents/)

跨平台、框架编译转换框架。

# 介绍

## 简介

**Ditto** 本质上是一个基于框架的编译转换工具，使用它，你可以轻易的实现编写一套代码，输出不同框架原生代码，从而达到跨平台、跨框架的目的。

> 为什么编译为原生代码？`ditto` 的愿景是简单、快速、便捷的实现代码转换，从而可以充分的体验各式框架的优点，在不同场景下可以选择最为切合的技术框架。所以 `ditto` 选择编译为目标原生干净的代码，最大化的发挥目标框架本身的优势。

为了便于编译转换工作的进行，`ditto` 提供了一套编码规范，参考规范书写的代码才能够使用 `ditto` 进行编译转换。同时为了满足不同场景定制化的需求，编码规范以及编译转换规则都是可配置的，并以插件的形式存在。即通过定制化的插件实现对应的编译输出，如 `ditto` 内置的 `wechat` 和 `vue2` 插件会分别编译为微信小程序原生代码和 `vue.js` 2.0 原生代码。


现如今前端开发需要考虑的平台越来越多，前端框架也如雨后春笋般出现，针对不同端去编写多套代码成本非常高，去尝试不同的前端框架也需要一定的成本，这时候只编写一套代码就能够运行到不同的平台，以及嵌入不同的框架的能力就显得极为需要，`ditto` 的初衷也是为了解决这个痛点问题。

使用 `ditto`, 只需要书写一套代码，再通过 `ditto` 编译为不同平台原生代码或是不同框架代码，就可以达到多端复用以及跨框架复用的目的。

## 特性

### 声明式语法

`ditto` 的语法规范与 `Vue.js` 类似，同时支持 jsx 语法，让模板具有更强的表现力。

### 组件式开发

`ditto` 的组件化开发方式与 vue 基本保持一致，需要注意的一点是，在 `ditto` 中触发数据的更新需要通过 `this.setData` API 来显示的更新。但当选择编译为 vue 原生代码时，编译工具会自动替换为 vue 的数据更新方式。

### 开放式框架

`ditto` 本身不具备编译成特定平台代码的功能，而是通过接口的形式将转译需要的数据提供给插件开发者，这样就可以通过不同的插件实现而得到不同的编译转换。

如 `Ditto.createCompiler('vue2');` 就通过引入 vue2 插件而创建了一个 vue2 类型的编译器，通过创建的编译器就可以将代码编译为对应 vue 2 代码。

### 编码约束

* 需编译转换组件

    以 `/* @component */`形式的注释代码将组件代码（模板、样式、逻辑部分）与其它代码分开
* 若是一个路由文件则以 `/* @router */` 标识
* 子组件及组件样式模板引入代码需以 /* @import /开始并以空行结束
* 组件名与组件文件名保持一致
* 组件需包含 `name` 属性及组件名必须

#### 代码示例

##### 组件逻辑

`./app.js`

```js
/* @import */
import Footer from '../components/footer/footer';
import template from './app.tpl.js';
import Style from './app.style.js';

/* @component */
export default {
    name: 'app',
    style: Style,
    template: template(Footer),
    props: {

    },
    data: {
        hi: 'hello world!',
        statusMsg: 'Not ready!',
        items: [1, 2, 3, 4]
    },
    methods: {
        onShowMessage () {
            console.log('wellcome to here!');
        }
    },
    ready () {
        this.setData({
            statusMsg: 'I am ready.'
        })
    }
}
```

##### 组件样式

`./app.style.js`

```js
const Style = {
  pageWrap: {
      display: 'flex',
      width: "100%",
      height: "100%",
      flexDirection: 'column'
  },
  header: {
      flex: 1,
      height: 200,
      backgroundColor: 'red'
  },
  container: {
      flex: 1,
      height: 500,
      backgroundColor: '#eee'
  }
};
export default  Style;

```

##### 组件模板

`./app.tpl.js`

```js
const template = (Footer) => (
    <View className='page-wrap'>
        <View className='header'>
            <Text text='hi'></Text>
        </View>
        <View v-for='(item, index) in items' key='index' className='container'>
            <Text on-click='onShowMessage'
                text='statusMsg'>
            </Text>
        </View>
        <View>
            <Component v-ref={Footer} />
        </View>
    </View>
)

export default template;
```

> 注：样式和模板既可以使用单文件的形式，也可以直接编写在同一个文件中，因为他们都遵循 javascript（jsx） 语法规范。但如果使用单文件，那么样式和模板的后缀必须为 `.style.js` 和 `.tpl.js`。

## plugins

* `wechat`
* `vue2`
* more...


## 各平台、各框架业务代码处理方案

### 平台限定代码文件约束

* 存在在特定平台目录下
* 以平台类型为后缀 (eg: `.wechat.js`)

### 代码引入约束

* 特定平台处理函数内使用
* `if else` 配合平台变量使用，且只能在代码块是使用