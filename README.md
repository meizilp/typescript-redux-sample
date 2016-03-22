
注：本文的原始资料和示例来自 [ServiceStackApps/typescript-redux](https://github.com/ServiceStackApps/typescript-redux) ,根据我的实际情况，做了一些调整，详见文内说明，感谢原作者的无私分享。

本文通过设置，运行和探索Javascript一些高级的技术栈：

  - [TypeScript](http://www.typescriptlang.org/) - 具备类型的Javascript超集, 提供一些高级别的语法特性（注：真正的面向对象等）和部分ES5的支持
  - [typings](https://github.com/typings/typings) - 用于搜索和安装TypeScript语法定义的包管理器
  - [React](https://facebook.github.io/react/) - 简单，高性能的javascript UI层框架，利用虚拟DOM和应答数据流 
  - [Redux](https://github.com/rackt/redux) - javascript 应用程序的状态管理框架，非常适合和React搭配使用
  
Providing a great base for the development of large-scale, JavaScript Apps that's further enhanced by a great 
development experience within Visual Studio.
提供开发大型javascript应用程序强大的基础，并改进在Visual Studio中的开发体验（注：事实上，并非一定在Visual Studio中，其他的编辑器也是可以的）

## 安装 TypeScript

如果你还没有从[typescriptlang.org](http://www.typescriptlang.org)下载安装最新版本的Typescript。Visual Studio的用户可以直接使用下面的链接快速安装：

 - [VS.NET 2015](https://www.microsoft.com/en-us/download/details.aspx?id=48593)
 - [VS.NET 2013](https://www.microsoft.com/en-us/download/details.aspx?id=48739)

> 本文已经默认你已经安装了TypeScript v1.8 或更高的版本

（注：原文中使用JSPM作为nodejs的包管理器，本文中我仍然使用npm来代替，原文中使用system作为模块加载器，本文中用webpack代替）

## 创建 一个 ASP.NET Web 项目（如果你的编辑器不是VS.NET，那就直接跳过到配置TypeScript）

虽然安装了 TypeScript VS.NET 扩展提供了，一个新的 **HTML Application with TypeScript** 项目模板，但是你最好还是通过创建一个 **Empty ASP.NET Web Application** 项目并配置项目支持Typescript -- 这比把它从Typescript转换成 ASP.NET Web项目要方便的多。.

![](https://raw.githubusercontent.com/xuanye/typescript-redux-sample/master/img/01-empty-web-project.png)

在接下来的界面 选择 **Empty** 模板来创建一个空模板:

![](https://raw.githubusercontent.com/xuanye/typescript-redux-sample/master/img/02-empty-web-template.png)

### 启用 TypeScript
在项目的右键菜单`Add > TypeScript File`中添加一个 **TypeScript File** 文件就会自动配置的你Web项目 `.csproj` 文件，加上一些启用TypeScript 支持必须的导入项：
![](https://raw.githubusercontent.com/xuanye/typescript-redux-sample/master/img/03-add-typescript-file.png)

配置的时候会弹出对话框:

![](https://raw.githubusercontent.com/xuanye/typescript-redux-sample/master/img/04-typescript-confirmation-dialog.png)

点击 **No** 来跳过使用Nuget对话框来安装Typing 定义文件，因为我们后面会使用[typings Package Manager](https://github.com/typings/typings) 来代替它安装定义文件.

### 配置 TypeScript

在项目中第一激活TypeScript需要配置一些选项。VS.NET 2015 可以通过项目属性中的`Typescript Build`配置节来配置TypeScript的编译选项，这些信息将直接配置到VS的**.csproj**项目文件中，如下图所示：
![TypeScript Properties Page]https://raw.githubusercontent.com/xuanye/typescript-redux-sample/master/img/05-configure-typescript-vs.png)

不过我们更倾向于使用`tsconfig.json`的一个文本文件来配置这些选项，而且这个配置文件可以更好的适配到其他的编辑器/IDE中，更利于知识的分享，减少一些不必要的问题。

在项目上右键`Add > New Item` 在打开的对话框中搜索 **typescript**，并选择 **TypeScript JSON Configuration File**  文件模板 来添加`tsconfig.json` 到你的项目中：


![](https://raw.githubusercontent.com/xuanye/typescript-redux-sample/master/img/05-add-tsconfig.png)

这会添加一个基础的`tsconfig.json`配置文件到你的项目中，这些配置会替换掉你之前在`.csproj` 项目文件中配置的变量


### tsconfig for webpack, React and JSX

为了更快的进入状态，你可以复制下面的配置信息并替换你的`tsconfig.json` 文件内容：

```json
{
  
  "compilerOptions": {
    "noImplicitAny": false,
    "noEmitOnError": true,
    "removeComments": false, 
    "module": "commonjs",  
    "sourceMap": true,
    "target": "es5",   
    "jsx": "react",
    "experimentalDecorators": true
  },
  "exclude": [
    "typings",
    "node_modules",   
    "wwwroot"
  ]
}

```

和默认的 `tsconfig.json` 有所不同的是 :

 - `target:es5` - 将编译的javascript设置成es5版本
 - `module:commonjs` - 使用commonjs作为模块加载器（事实上无所谓，我们最终使用webpack打包）
 - `jsx:react` - 将 `.tsx` 文件转换成 React的 JavaScript 语法，而不是jsx语法。
 - `experimentalDecorators:true` -启用ES7装饰器语法支持，事实上这个语法规则还没有确定，所以本文中弃用了
 - `exclude:node_modules` - 排除一些文件夹，不要去编译这些文件夹下面的typescript代码。

> [VS 2013 不支持 tsconfig.json](https://github.com/Microsoft/TypeScript/issues/6782#issuecomment-187820198)
但是不打紧，我们最终使用webpack打包代码，而不是vs本身，所以。。你懂的

## 安装 webpack

Webpack 是德国开发者 Tobias Koppers 开发的模块加载器，它和传统的commonjs和requirejs的不同之处，在于，它在运行时是不需要它本身的，js和其他一些资源文件（css，图片等）在运行之前就已经并合并到了一起，并且它的很多插件让你可以在做很多预编译的事情（比如本文中的将typescript编译成es5版本的javascript）。

事实上，我并非对它很熟悉，也只是参与了很多的资料，：） 你可以从下面的这些链接获取到一些有用的信息：

- [官网][1]
- [webpack入门指南][2]    
- [Typescript 中文手册中的相关介绍][3]

安装 webpack本身非常方便，只要使用npm命令全局安装就可以了：

    C:\proj> npm install webpack -g
    
等待执行完成即可。

### 初始化项目
在项目目录下执行 npm init 为项目创建一个package.json文件，以便我们后续安装一些相关的包到本地

    C:\proj> npm init
    
### 配置webpack
使用webpack 打包typescript代码，并编译成javascript需要安装一些插件，来安装一下:

    C:\proj> npm install ts-loader source-map-loader --save-dev

初始化项目的文件夹结构，之所以在这里说，是因为我们下面的配置文件会使用到对应的目录地址，建成后的目录结构如图所示：

![](https://raw.githubusercontent.com/xuanye/typescript-redux-sample/master/img/06-folder-list.png)

其中
`source` 目录用于存放Typescript源代码文件(**本例中为了路径引用方便，我将HTML文件也放到里该目录下，实际项目中不用这么做**)
`wwwroot/js` 用于存放生成js文件和引用的第三方类库（jquery,zepto等等）
本例中，我将reactjs的js文件放到`wwwroot/js/lib`目录中，并在页面上单独引用。

完成后，在项目目录添加一个`webpack.config.js`文件，该文件是webpake的配置文件，将以下代码复制到文件中：
```json
module.exports = {
    entry: "./source/index.ts",
    output: {
        filename: "./wwwroot/js/[name].js",
    },
    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",
    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    },

    module: {
        loaders: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
            { test: /\.tsx?$/, loader: "ts-loader" }
        ],

        preLoaders: [
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { test: /\.js$/, loader: "source-map-loader" }
        ]
    },
    // When importing a module whose path matches one of the following, just
    // assume a corresponding global variable exists and use that instead.
    // This is important because it allows us to avoid bundling all of our
    // dependencies, which allows browsers to cache those libraries between builds.
    externals: {
        "react": "React",
        "react-dom": "ReactDOM"
    }
};

```

关于webpack.config.js中的详细说明，可参考[官方的说明][4]，其中`externals`配置节是用于排除，单独引用的reactjs类库，不打包进生成的文件，`entry`入口这里是示例，在下面的章节会替换成实际的内容。

### 安装 React

通过npm 安装 react到本地，你可以可以手动到官网下载最新的版本，并复制到`wwwroot/js/lib` 目录下:

    C:\proj> npm install react --save

从 v0.14 开始 React 将dom操作分离到一个单独的包中，我们也来安装一下:

    C:\proj> npm install react-dom --save
    

手动将react库 从`node_modules` 复制到 `wwwroot/js/lib` 目录中，如下图所示：  

![](https://raw.githubusercontent.com/xuanye/typescript-redux-sample/master/img/06-folder-react.png)

我们实际使用到的文件是`react.min.js`和`react-dom.min.js` 。

### 安装 typings -  TypeScript definitions的管理器

为了能够开启Typescript的自动完成和类型检查支持，我们需要下载一些第三方类库的类型定义文件，最好的方式是通过安装[typings](https://github.com/typings/typings) 
可以通过npm来全局安装它:

    C:\proj> npm install typings -g

现在我们可以通过 `typings` 命令来安装我们需要的TypeScript 类型定义文件了。

#### Install React Type Definitions

    C:\proj> typings install react --ambient --save

#### Install React DOM Type Definitions

    C:\proj> typings install react-dom --ambient --save

The `--ambient` 标志是让 **typings** 在社区版本中查找 `.d.ts` TypeScript 定义文件，它们都在[DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped)  
`--save` 标志是让这些安装的信息保存到`typings.json`配置文件中

安装完成后你打开文件 `typings/browser.d.ts` 可以看到:

```typescript
/// <reference path="main\ambient\react-dom\react-dom.d.ts" />
/// <reference path="main\ambient\react\react.d.ts" />
```

在其他文件中使用这些类型定义文件，只需要引用`typings/browser.d.ts`文件即可：

```typescript
/// <reference path='../typings/browser.d.ts'/>
```

## 开始 用 TypeScript 编码了

太棒了! 到这里我们终于有了一个可以工作的Typescript开发环境的，可以开始编写TypeScript 和 React代码，并看看它们是否正常工作，接下来的代码按照我们之前的约定，在`./source`目录添加你的代码，好了，我们从一个最简单的React 示例开始吧:

## [Example 1 - HelloWorld](https://github.com/xuanye/typescript-redux-sample/tree/master/src/TypescriptRedux/TypescriptRedux.WebHost/source/sample01)

在第一个示例中，我们要编写一个最简单能正常运行的应用，气死就是 `Helloworld`
在 `source` 目录下新建 `example01/` 文件夹，并添加第一个 TypeScript 文件 : 

#### [app.tsx](https://github.com/xuanye/typescript-redux-sample/tree/master/src/TypescriptRedux/TypescriptRedux.WebHost/source/sample01/app.tsx)

```typescript
/// <reference path='../../typings/browser.d.ts'/>

import * as React from "react";
import * as ReactDOM from "react-dom";

class HelloWorld extends React.Component<any, any> {
    render() {
        return <div>Hello, World!</div>;
    }
}
ReactDOM.render(<HelloWorld/>, document.getElementById("content"));
```
这里我们来一起看一看，这个代码是怎么运行的：

先来看看第一行代码：

```typescript
/// <reference path='../../typings/browser.d.ts'/>
```

使用了 [Reference 标签](http://blogs.msdn.com/b/webdev/archive/2007/11/06/jscript-intellisense-a-reference-for-the-reference-tag.aspx)来引用所有的之前通过**typings**安装的 [Definitely Typed](https://github.com/DefinitelyTyped/DefinitelyTyped)  文件

看一下 `import` 语句:

```typescript
import * as React from 'react';
import * as ReactDOM from 'react-dom';
```
导入之前使用 `npm` 命令安装的Javascript模块 （注：Typescript中可以使用第三方Javascript库，但是必须提供类型定义文件，没有的话需要写一个）, `*` 号表示导入整个模块，如果你希望只导入一个模块的话 ，你可以这么写：

```typescript
import { render } from 'react-dom';
```

唯一的例外是在 `.tsx`文件中，必须导入 **React**模块，否则在使用JSX代码块时会发生编译错误：

    return <div>Hello, World!</div>; //compile error: Cannot find name React

下面的代码是创建一个组件（component）继承至 React的`Component<TProps,TState>`基类：

```typescript
class HelloWorld extends React.Component<any, any> {
```
当我们的组件（Components） 不包含任何特定的属性（ property）和状态（state）时，我们可以使用 `any` 类型来忽略一些特殊的类型
When Components doesn't have any properties or state they can use `any` to ignore specifying types.

我们之前在TypeScript配置中已经启用了jsx语法支持，我们可以在**.tsx** 使用jsx语法了（注：和配置没啥关系，配置只是用来编译生成代码的，tsx天生就是支持jsx语法的）

```typescript
    render() {
        return <div>Hello, World!</div>;
    }
```
最后一行是一个标准的React代码，它意思是在`#content` DOM 节点中输出我们的 `HelloWorld` 组件（component）的实例：


```typescript
ReactDOM.render(<HelloWorld/>, document.getElementById("content"));
```

现在，所有剩下的就是建立一个HTML页面来容纳我们的刚刚编写的组件啦（component）：

#### [index.html](https://github.com/xuanye/typescript-redux-sample/tree/master/src/TypescriptRedux/TypescriptRedux.WebHost/source/sample01/index.html)


```html
<!DOCTYPE html>
<html>
<head>
    <title>TypeScript + React + Redux</title>

</head>
<body>
    <h1>Example 2</h1>
    <div id="content"></div>
    <script src="../../wwwroot/js/lib/react/react.min.js"></script>
    <script src="../../wwwroot/js/lib/react/react-dom.min.js"></script>
    <script src="../../wwwroot/js/sample02.js"></script>
</body>
</html>

```

> **index.html** 是一个在ASP.NET中预定义的默认文档，用来让我们可以浏览之前编写的组件效果，它被安排在各个示例文件夹中，像我之前说的那样，并不是非要放在这里，只是为了更好的组织url。上述的 index.html在目录`/example01/`中。

首先，我们必须引入 `react.min.js` 和 `react-dom.min.js` 文件，之前有谈到过，webpack.config.js配置中设置react本身不被打包，而是单独引用。一些通用的第三方类库，为了更好的使用CDN和缓存，可以使用单独引用的方式，当然也可以打包在一起，哪种方式要看实际的情况。

```html
    <script src="../../wwwroot/js/lib/react/react.min.js"></script>
    <script src="../../wwwroot/js/lib/react/react-dom.min.js"></script>

```

同时我们引入了一个 `sample02.js`的文件，这有点奇怪，因为这个文件我们并没有创建，它这时确实也并不存在

```html
    <script src="../../wwwroot/js/sample02.js"></script>
```

这就是我们接下来要处理的问题，之前我们讲到我会使用 `webpack` 来 代替默认使用 `VS.NET 2015` 作为 `Typescript` 的编译器，`sample02.js`文件其实是 `webpack` 自动生成的文件。这个时候它不存在，是因为我们还没有配置好它，让我们重新打开`webpack.config.js`文件，看看里面的内容：

```json
module.exports = {
   entry: {
        sample01: "./source/sample01/app.tsx" //将示例1的app.tsx文件作为入口文件
    },
    output: {
        filename: "./wwwroot/js/[name].js",
    },
    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",
    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    },

    module: {
        loaders: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
            { test: /\.tsx?$/, loader: "ts-loader" }
        ],

        preLoaders: [
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { test: /\.js$/, loader: "source-map-loader" }
        ]
    },
    // When importing a module whose path matches one of the following, just
    // assume a corresponding global variable exists and use that instead.
    // This is important because it allows us to avoid bundling all of our
    // dependencies, which allows browsers to cache those libraries between builds.
    externals: {
        "react": "React",
        "react-dom": "ReactDOM"
    }
};
```

和之前的内容相比，只修改了 `entry` 配置节，将 `./source/sample01/app.tsx` 作为一个入口文件，并命名为 `sample01`, 而输出的目录则是 `./wwwroot/js/` 并且以入口的名字作为文件名 `[name].js`,所以在 `index.html` 我引入的文件 `../../wwwroot/js/sample02.js`

```json
    entry: {
        sample01: "./source/sample01/app.tsx" //将示例1的app.tsx文件作为入口文件
    },
    output: {
        filename: "./wwwroot/js/[name].js",
    },
```

回到 `index.html` 文件中

最后添加一个 `<div/>`  空标签元素，并设置 `id` 为 `content` 用来输出React组件。

```html
    <div id="content"></div>
```

现在所有的工作做完后，我们打开浏览器直接访问`/example01/`来查看效果了 -- 哈哈，我们第一个可运行的React应用！

[![](https://raw.githubusercontent.com/xuanye/typescript-redux-sample/master/img/preview-01.png)](http://servicestackapps.github.io/typescript-redux/example01/)

> Demo: [/typescript-redux/example01/](http://servicestackapps.github.io/typescript-redux/example01/)



**提示**： 我使用了 `VS.NET 2015` 作为开发工具，所以自带httpserver ，如果你并不是用`VS.NET 2015` ，那么可以任意的 `http server` 工具来查看示例。

如使用node 的 `http-server`包
全局安装：

    C:\proj> npm install http-server -g

然后在项目的根目录运行：

    C:\proj> http-server 
    
打开浏览器 查看 ：`http://localhost:8080/source/sample01/index.html`


## [Example 2 - 模块化 HelloWorld](https://github.com/xuanye/typescript-redux-sample/tree/master/src/TypescriptRedux/TypescriptRedux.WebHost/source/example02)

在第二个示例中，我们将尝试通过移动`<HelloWorld />`的实现到独立的文件中来模块化我们的应用：


### [helloworld.tsx](https://github.com/xuanye/typescript-redux-sample/tree/master/src/TypescriptRedux/TypescriptRedux.WebHost/source/example02/helloworld.tsx)

```typescript
import * as React from "react";

export class HelloWorld extends React.Component<any, any> {
    render() {
        return <div>Hello world!It's from Helloword Component.</div>;
    }
}
```
为了让HelloWorld组件在外部可以被调用，我们需要使用 `export` 关键字。我们同样可以使用 `default` 关键字来定义一个**默认导出**（**default export**），让使用者导入的时候更加方便，并可以重命名称它们喜欢的名字，然后我们需要移除在**app.tsx**中的HelloWorld实现，并用import 新组件的方式代替它：

### [app.tsx](https://github.com/xuanye/typescript-redux-sample/tree/master/src/TypescriptRedux/TypescriptRedux.WebHost/source/example02/app.tsx)

```typescript
/ <reference path='../../typings/browser.d.ts'/>

import * as React from "react";
import * as ReactDOM from "react-dom";

import {HelloWorld} from "./helloworld";

ReactDOM.render(<HelloWorld/>, document.getElementById("content"));

```

如果我们使用**默认导出**（**default export**），那么导入的部分就是这样的：

```typescript
import  HelloWorld  from './HelloWorld';
```

这个示例的改动非常小，我们来看一下，我们的程序是否还能正常运行。

> 注：这里要注意我们仍需在webpack.config.js中添加 entry ，后续的示例不再重复了

```json
    entry: {
        sample01: "./source/sample01/app.tsx",
        sample02: "./source/sample02/app.tsx"
    },
    ...
```

[![](https://raw.githubusercontent.com/xuanye/typescript-redux-sample/tree/master/img/preview-02.png)](http://servicestackapps.github.io/typescript-redux/example02/)
> Demo: [/typescript-redux/example02/](http://servicestackapps.github.io/typescript-redux/example02/)

## [Example 3 - 创建一个有状态的组件](https://github.com/xuanye/typescript-redux-sample/tree/master/src/TypescriptRedux/TypescriptRedux.WebHost/source/example03)

现在我们已经是Helloworld界的大师了，应该升级下我们的游戏规则，创建一些更高级的有状态的组件了，毕竟不能100级了，还在新手村。

我们要做的第一件伟大的事情就是计数器，是的，我们把示例中的 `helloword` 文件修改文件名为 `counter` 并把内容修改如下：


#### [counter.tsx](https://github.com/xuanye/typescript-redux-sample/tree/master/src/TypescriptRedux/TypescriptRedux.WebHost/source/example03/counter.tsx)

```typescript
import * as React from "react";


export default class Counter extends React.Component<any, any> {

   constructor(props, context) {
        super(props, context);
        this.state = { counter: 0 };
    }
    render() {
        return (
            <div>
                <p>
                    <label>Counter: </label><b>#{this.state.counter}</b>
                </p>
                <button onClick={e => this.incr(1) }>INCREMENT</button>
                <span style={{ padding: "0 5px" }} />
                <button onClick={e => this.incr(-1) }>DECREMENT</button>
            </div>
        );
    }

    incr(by:number) {
        this.setState({ counter: this.state.counter + by });
    }
}
```

好像没什么惊喜，我们在页面中添加了一个计数器，通过按钮 increment / decrement 来改变它的值， 实际使用的是React内置的`setState()`方法:

[![](https://raw.githubusercontent.com/xuanye/typescript-redux-sample/tree/master/img/preview-03.png)](http://servicestackapps.github.io/typescript-redux/example03/) 
> Demo: [/typescript-redux/example03/](http://servicestackapps.github.io/typescript-redux/example03/)

### 使用 Redux 

使用 `setState()` 是在组件中改变状态的老办法了，现在比较流行的是使用 [Redux](https://github.com/rackt/redux)，在使用之前，我们需要安装一下:

    C:\proj> npm install redux --save

同样也要安装它的定义文件 Type Definitions:

    C:\proj> typings install redux --ambient --save

## [Example 4 - 使用 Redux 改造计数器](https://github.com/xuanye/typescript-redux-sample/tree/master/src/TypescriptRedux/TypescriptRedux.WebHost/source/example04)

如果你对Redux 还不太熟悉，现在是开始的时候,下面是一些相关的问题（不过下面的网站在天朝基本都打不开）：

- [Redux docs](http://rackt.org/redux/) 
- [30 short videos](https://egghead.io/series/getting-started-with-redux) 
- [@dan_abramov](https://twitter.com/dan_abramov) 

这里推荐两个中文在线文档吧，虽然也经常打不开：

- [Redux中文指南][5]
- [Redux tutorial 中文][6]

Redux 是 JavaScript 状态容器，提供可预测化的状态管理。

可以让你构建一致化的应用，运行于不同的环境（客户端、服务器、原生应用），并且易于测试。不仅于此，它还提供 超爽的开发体验，比如有一个时间旅行调试器可以编辑后实时预览。

Redux 除了和 React 一起用外，还支持其它界面库。
它体小精悍（只有2kB）且没有任何依赖。

现在我们知道Redux 是什么了，让我们开始改造我们的计数器：

#### [counter.tsx](https://github.com/xuanye/typescript-redux-sample/tree/master/src/TypescriptRedux/TypescriptRedux.WebHost/source/example04/Counter.tsx)

```typescript
import * as React from 'react';
import { createStore } from 'redux';

let store = createStore(
    (state, action) => {
        switch (action.type) {
            case 'INCR':
                return { counter: state.counter + action.by };
            default:
                return state;
        }
    },
    { counter: 0 });

export default class Counter extends React.Component<any, any> {
    private unsubscribe: Function;
    componentDidMount() {
        this.unsubscribe = store.subscribe(() => this.forceUpdate());
    }
    componentWillUnmount() {
        this.unsubscribe();
    }
    render() {
        return (
            <div>
                <p>
                    <label>Counter: </label><b>#{store.getState().counter}</b>
                </p>
                <button onClick={e => store.dispatch({ type:'INCR', by: 1 }) }>INCREMENT</button>
                <span style={{ padding: "0 5px" }} />
                <button onClick={e => store.dispatch({ type:'INCR', by: -1 }) }>DECREMENT</button>
            </div>
        );
    }
}

```

### 创建一个 Redux Store

引用**redux**模块的 `createStore`方法，并创建一个Redux store ，并传递默认的state:

```typescript
import { createStore } from 'redux';

let store = createStore(
    (state, action) => {
        switch (action.type) {
            case 'INCR':
                return { counter: state.counter + action.by };
            default:
                return state;
        }
    },
    { counter: 0 });
```
因为我们的计数器只有一个Action ，我们的reducer（Redux中的专有名词，即处理Action的函数）的实现就比较简单 - 返回更新的计数器对象

另外一件我们需要知道的关于Redux的事情是Redux是独立于React的，并不像 `setState()` 那样内置在其中的。React并不知道什么时候你的Redux Store中的State发生了变化--其实是需要知道的，因为你的组件要知道什么时候需要重绘。因为这个，我们需要注册一个监听器来观察 store的state变化来强制触发组件的重绘：


```typescript
    private unsubscribe: Function;
    
    componentDidMount() {
        this.unsubscribe = store.subscribe(() => this.forceUpdate());
    }
    componentWillUnmount() {
        this.unsubscribe();
    }
```

我们还需要将修改组件通过`store.getState()` 方法读取它的state信息，并修改之前的内置方式`setState()`方法为触发一个Action来修改我们应用的state 。

```typescript
    render() {
        return (
            <div>
                <p>
                    <label>Counter: </label><b>#{store.getState().counter}</b>
                </p>
                <button onClick={e => store.dispatch({ type:'INCR', by: 1 }) }>INCREMENT</button>
                <span style={{ padding: "0 5px" }} />
                <button onClick={e => store.dispatch({ type:'INCR', by: -1 }) }>DECREMENT</button>
            </div>
        );
    }
```

现在我们的计数器已经"Redux化"了，重新运行一下示例，并看看和之前的效果是否一致？ 

[![](https://raw.githubusercontent.com/xuanye/typescript-redux-sample/tree/master/img/preview-04.png)](http://servicestackapps.github.io/typescript-redux/example04/)
> Demo: [/typescript-redux/example04/](http://servicestackapps.github.io/typescript-redux/example04/)

## 安装 React Redux

在上一个示例中，我们在`Counter`模块中创建了 Redux store 来帮助我们优化代码。因为你的应用应该只有一个Store，所以这不是一个正确使用它的方式 （关于这个原则，你需要参看Redux的相关文档），我们使用Redux的React帮助库来帮我们改善这种情况。

事实上，当我们结合Redux和React的时候，我们必须安装的一个包就是`react-redux`，它同样可以通过  **npm** 方式安装

    C:\proj> npm install react-redux --save

和大多数流行的类库一样，它也已经有了类型定义文件了，一起来安装一下吧：

    C:\proj> typings install react-redux --ambient --save

## [Example 5 - 使用 Provider 注入store到纸容器的上下文（context）中](https://github.com/ServiceStackApps/typescript-redux/tree/master/src/TypeScriptRedux/src/example05)

在这个示例中，我们将 Redux store 移动到上一层的**app.tsx** 文件中，就像这样

#### [app.tsx](https://github.com/xuanye/typescript-redux-sample/tree/master/src/TypescriptRedux/TypescriptRedux.WebHost/source/example05/app.tsx)

```typescript
import * as React from "react";
import * as ReactDOM from "react-dom";
import { createStore } from "redux";
import { Provider } from "react-redux";

import Counter from "./counter";

let store = createStore(
    (state, action) => {
        switch (action.type) {
            case 'INCR':
                return { counter: state.counter + action.by };
            default:
                return state;
        }
    },
    { counter: 0 });

ReactDOM.render(
    <Provider store={store}>
        <Counter />
    </Provider>,
    document.getElementById("content"));
```

为了传递store到我们的组件中，我们使用了[React's child context](https://facebook.github.io/react/docs/context.html) 特性 ， 在 **react-redux** 封装了 `<Provider/>`组件 ，我们直接使用就可以了。

为了让React知道 我们希望把store注入到我们的 `Counter` 组件中，我们还需要定义个静态的`contextTypes` 属性 制定context中需要的内容：


#### [counter.tsx](https://github.com/xuanye/typescript-redux-sample/tree/master/src/TypescriptRedux/TypescriptRedux.WebHost/source/example05/counter.tsx)

```typescript
import * as React from 'react';

export default class Counter extends React.Component<any, any> {
    context: any;
    static contextTypes = {
        store: React.PropTypes.object
    }
    private unsubscribe: Function;
    componentDidMount() {
        this.unsubscribe = this.context.store.subscribe(() => this.forceUpdate());
    }
    componentWillUnmount() {
        this.unsubscribe();
    }
    render() {
        return (
            <div>
                <p>
                    <label>Counter: </label><b>#{this.context.store.getState().counter}</b>
                </p>
                <button onClick={e => this.context.store.dispatch({ type:'INCR', by: 1 }) }>INCREMENT</button>
                <span style={{ padding: "0 5px" }} />
                <button onClick={e => this.context.store.dispatch({ type:'INCR', by: -1 }) }>DECREMENT</button>
            </div>
        );
    }
}
```

改动对页面没什么影响，我们的程序应该还是可以正常运行：

[![](https://raw.githubusercontent.com/xuanye/typescript-redux-sample/tree/master/img/preview-05.png)](http://servicestackapps.github.io/typescript-redux/example05/)
> Demo: [/typescript-redux/example05/](http://servicestackapps.github.io/typescript-redux/example05/)


## [Example 6 - 使用 connect() 创建无状态的组件](https://github.com/xuanye/typescript-redux-sample/tree/master/src/TypescriptRedux/TypescriptRedux.WebHost/source/example06)

我们已经编写了一些示例程序，现在哦我们回过头来重新看看一下。在上一个例子中，我们看到我们可以通过 `Provider` 组件来传递 state到我们的子组件，**react-redux** 同样也提供了一些其他的方式。


Redux的 `connect()` 函数返回一个更高级别的组件，它可以让组件变得无状态（stateless）, 通过将state和callback函数映射到组件的属性上（properties）以降低组件和Redux Store的耦合度：

#### [counter.tsx](https://github.com/xuanye/typescript-redux-sample/tree/master/src/TypescriptRedux/TypescriptRedux.WebHost/source/example06/counter.tsx)

```typescript
import * as React from 'react';
import { connect } from 'react-redux';

class Counter extends React.Component<any, any> {
    render() {
        return (
            <div>
                <p>
                    <label>Counter: </label>
                    <b>#{this.props.counter}</b>
                </p>
                <button onClick={e => this.props.incr() }>INCREMENT</button>
                <span style={{ padding: "0 5px" }} />
                <button onClick={e => this.props.decr() }>DECREMENT</button>
            </div>
        );
    }
}

const mapStateToProps = (state) => state;

const mapDispatchToProps = (dispatch) => ({
    incr: () => {
        dispatch({ type: 'INCR', by: 1 });
    },
    decr: () => {
        dispatch({ type: 'INCR', by: -1 });
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Counter);
```

为了达到这个效果，我们通过传递一个 **mapStateToProps** 的函数 ，这个函数返回一个对象，这个对象包含组件所需要的所有状态（state）。
我们的组件仍然需要更新状态，所以还需要传递一个 **mapDispatchToProps** 的函数，这个函数通过调用，将组织需要传递到Redux action的参数，并触发对应在store中注册的Reduce。

Redux的 `connect()`  会将上述函数组合到一个更高一级的组件中，并订阅Redux store的变化，通过更新state来改变组件的属性并重绘（实际上的子组件） `Counter` 组件

这些修改对页面来说仍然是透明的，你可以打开并重新试试它的功能

[![](https://raw.githubusercontent.com/xuanye/typescript-redux-sample/tree/master/img/preview-06.png)](http://servicestackapps.github.io/typescript-redux/example06/)
> Demo: [/typescript-redux/example06/](http://servicestackapps.github.io/typescript-redux/example06/)

## 安装 es6-shim

原文中的这个章节是为了合并对象，安装es6-shim，并使用其中的 `Object.assign()` 方法，我从[Object.assign()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)，这里重新复制了Polyfill如下，而没有使用 es6-shim ，如下代码所示：

```javascript
if (typeof Object.assign != 'function') {
  (function () {
    Object.assign = function (target) {
      'use strict';
      if (target === undefined || target === null) {
        throw new TypeError('Cannot convert undefined or null to object');
      }

      var output = Object(target);
      for (var index = 1; index < arguments.length; index++) {
        var source = arguments[index];
        if (source !== undefined && source !== null) {
          for (var nextKey in source) {
            if (source.hasOwnProperty(nextKey)) {
              output[nextKey] = source[nextKey];
            }
          }
        }
      }
      return output;
    };
  })();
}
```

## [Example 7 - Shape Creator](https://github.com/xuanye/typescript-redux-sample/tree/master/src/TypescriptRedux/TypescriptRedux.WebHost/source/example07)

我们的下一个例子 我们将扩展Redux创建一个更大，更高级的真实的应用程序，通过这个例子进一步探索它的好处。这个世界不需要另外一个[TodoMVC](http://todomvc.com)应用了，所以我计划创建另外一个形状生成应用代替，它提供更多的视角去观察状态的变化。


### [Counter.tsx](https://github.com/xuanye/typescript-redux-sample/tree/master/src/TypescriptRedux/TypescriptRedux.WebHost/source/example07/counter.tsx)

我们将开始创建通过计数器（Counter）来控制控件的宽度和高度，为了达到这效果，需要重构一下我们的 `Counter` 组件，定义个`field`的属性来确定应该修改哪个状态（width/height），让其变得更加可复用。另外再增加一个 `step` 的属性来控制变化的尺度。

因为我们要发送多个Action，所以我们要适修改一下我们的Action Type名字，这里我们使用`{Type}_{Event}`格式来重命名它们，所以计数器的Action变成了`COUNTER_CHANGE`


```typescript
import * as React from 'react';
import { connect } from 'react-redux';

class Counter extends React.Component<any, any> {
    render() {
        var field = this.props.field, step = this.props.step || 1;
        return (
            <div>
                <p>
                    <label>{field}: </label>
                    <b>{this.props.counter}</b>
                </p>
                <button style={{width:30, margin:2}} onClick={e => this.props.decr(field, step)}>-</button>
                <button style={{width:30, margin:2}} onClick={e => this.props.incr(field, step)}>+</button>
            </div>
        );
    }
}

const mapStateToProps = (state, props) => ({ counter: state[props.field] || 0 });

const mapDispatchToProps = (dispatch) => ({
    incr: (field, step) => {
        dispatch({ type: 'COUNTER_CHANGE', field, by: step });
    },
    decr: (field, step) => {
        dispatch({ type: 'COUNTER_CHANGE', field, by: -1 * step });
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Counter);
```

现在它变得可以复用了，我们可以创建多个实例来控制我们形状的Width和Height了：

```html
<Counter field="width" step={10} />
<Counter field="height" step={10} />
```

它看上去就像这样:

![](https://raw.githubusercontent.com/xuanye/typescript-redux-sample/tree/master/img/shapes-dimensions.png)

### [colorpicker.tsx](https://github.com/xuanye/typescript-redux-sample/tree/master/src/TypescriptRedux/TypescriptRedux.WebHost/source/example07/colorpicker.tsx)

下一个组件我们需要一个控制颜色的组件，**range** INPUT 控件非常适合作为基础颜色调节器的空间，类似一个滑动条（这个控件在IE的老版本上没有办法识别，请大家不要用IE看），同时需要一个显示颜色的区域，唯一不寻常的事情是需要一个计算颜色亮度的函数用来区分是否显示白色或者黑色的前台文本 。

并且`<ColorPicker />` 是一个单纯的React控件，对Redux没有任何的依赖，所以稍后我们需要把它包装进一个更高级别的组件中:

```typescript
import * as React from 'react';

export class NumberPicker extends React.Component<any, any> {
    render() {
        return (
            <p>
                <input type="range" value={this.props.value.toString() } min="0" max="255"
                    onChange={e => this.handleChange(e) } />
                <label> {this.props.name}: </label>
                <b>{ this.props.value }</b>
            </p>
        );
    }
    handleChange(event) {
        const e = event.target as HTMLInputElement;
        this.props.onChange(parseInt(e.value));
    }
}

export class ColorPicker extends React.Component<any, any> {
    render() {
        const color = this.props.color;
        const rgb = hexToRgb(color);
        const textColor = isDark(color) ? '#fff' : '#000';

        return (
            <div>
                <NumberPicker name="Red" value={rgb.r} onChange={n => this.updateRed(n)} />
                <NumberPicker name="Green" value={rgb.g} onChange={n => this.updateGreen(n) } />
                <NumberPicker name="Blue" value={rgb.b} onChange={n => this.updateBlue(n) } />
                <div style={{
                    background: color, width: "100%", height: 40, lineHeight: "40px",
                    textAlign: "center", color: textColor
                }}>
                    {color}
                </div>
            </div>
        );
    }
    updateRed(n: number) {
        const rgb = hexToRgb(this.props.color);
        this.changeColor(rgbToHex(n, rgb.g, rgb.b));
    }
    updateGreen(n: number) {
        const rgb = hexToRgb(this.props.color);
        this.changeColor(rgbToHex(rgb.r, n, rgb.b));
    }
    updateBlue(n: number) {
        const rgb = hexToRgb(this.props.color);
        this.changeColor(rgbToHex(rgb.r, rgb.g, n));
    }
    changeColor(color: string) {
        this.props.onChange(color);  
    }
}

const componentToHex = (c) => {
    const hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
};

const rgbToHex = (r, g, b) => "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);

const hexToRgb = (hex: string): { r: number; g: number; b: number; } => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};

const luminance = (color: string) => {
    const rgb = hexToRgb(color);
    return 0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b;
};

export const isDark = (color: string) => luminance(color) < 100;
```

Which gets rendered as:

![](https://raw.githubusercontent.com/ServiceStackApps/typescript-redux/master/img/shapes-colorpicker.png)

### [ShapeMaker.tsx](https://github.com/ServiceStackApps/typescript-redux/blob/master/src/TypeScriptRedux/src/example07/ShapeMaker.tsx)

Our Shape Creator is nearly there, to introduce some more state we'll also capture the **top** and 
**left** positions indicating where to place it as well as a preview area showing the color and size 
of the shape, embedding the coordinates of where it will be placed. We'll also need to add the all important 
**Add Shape** button to add the Shape to our App: 

```typescript
import * as React from 'react';
import { connect } from 'react-redux';
import { isDark } from './ColorPicker';

class ShapeMaker extends React.Component<any, any> {
    constructor(props?, context?) {
        super(props, context);
        this.state = { top: props.top, left: props.left };
    }
    render() {
        var width = this.props.width, height = this.props.height, background = this.props.color;
        const color = isDark(background) ? '#fff' : '#000';
        return (
            <div>
                <p>
                    <label>size: </label>
                    <b>{height}x{width}</b>
                </p>
                <div style={{ height, width, background, color, lineHeight: height + "px", margin: "auto" }}>
                    ({this.state.top},{this.state.left})
                </div>
                <div>
                    <p>
                        <label>position: </label>
                        <input style={{width:30}} defaultValue={this.props.top} onChange={e => this.handleTop(e)} />
                        <span>,</span>
                        <input style={{width:30}} defaultValue={this.props.left} onChange={e => this.handleLeft(e)} />
                    </p>

                    <button onClick={e => this.props.addShape(background,height,width,this.state.top,this.state.left) }>
                        Add Shape
                    </button>
                </div>
            </div>
        );
    }
    handleTop(e) {
        var top = parseInt(e.target.value);
        if (!isNaN(top))
            this.setState({ top });
    }
    handleLeft(e) {
        var left = parseInt(e.target.value);
        if (!isNaN(left))
            this.setState({ left });
    }
}

export default connect(
    (state) => ({
        width: state.width, height: state.height, color: state.color,
        top: state.nextShapeId * 10, left: state.nextShapeId * 10
    }),
    (dispatch) => ({
        addShape: (color, height, width, top, left) => {
            dispatch({ type: 'SHAPE_ADD', height, width, color, top, left });
        }
    })
)(ShapeMaker);
```

Which gets generated as:

![](https://raw.githubusercontent.com/ServiceStackApps/typescript-redux/master/img/shapes-preview.png)

### Message-based Actions

Interestingly despite the number of moving parts of this Component it only emits a single `SHAPE_ADD` Action.
We're starting to see some of the benefits of Redux's approach as it forces us to expose our functionality 
behind coarse-grained API's disconnected from the DOM so now anyone with access to the Store automatically has
access to the Apps functionality which thanks to its message-based design
[offers a number of advantages](https://github.com/ServiceStack/ServiceStack/wiki/Advantages-of-message-based-web-services#advantages-of-message-based-designs)
over opaque function calls, e.g. since they're just plain JavaScript objects we could easily create and 
serialize 100 `SHAPE_ADD` actions and save them into localStorage for ourselves to restore later or even send 
to someone else who could generically apply them locally with minimal effort. 

### [ShapeViewer.tsx](https://github.com/ServiceStackApps/typescript-redux/blob/master/src/TypeScriptRedux/src/example07/ShapeViewer.tsx)

Now that we've got everything we need to create shapes, we'll also need a Component to view them. 
`ShapeViewer` does this by rendering a `DIV` in the size, color and position of each Shape added:

```typescript
import * as React from 'react';
import { connect } from 'react-redux';
import { isDark } from './ColorPicker';

class ShapeViewer extends React.Component<any, any> {
    constructor(props?, context?) {
        super(props, context);
        this.state = { isDragging: false};
    }
    render() {
        return (
            <div className="noselect" 
                style={{position:"relative",border:"solid 1px #ccc",width:860,height:500}}>
            { this.props.shapes.map(s => (
                <div key={s.id} style={{
                    position:"absolute",top:s.top,left:s.left,color:isDark(s.color)?'#fff':'#000',
                    background:s.color,width:s.width,height:s.height,
                    lineHeight:s.height+'px',textAlign:"center",cursor:'move'}}
                    onMouseDown={e => this.handleDragInit(e) }
                    onMouseUp={e => this.setState({ isDragging: false }) }
                    onMouseOut={e => this.setState({ isDragging: false }) }
                    onMouseMove={e => this.handleDrag(s.id, s.height, s.width, e) }>
                    ({s.top},{s.left})
                </div>)
            )}
            </div>
        );
    }
    handleDragInit(e) {
        var el = e.target as HTMLElement;
        while (el.nodeName !== 'DIV')
            el = el.parentNode as HTMLElement; //don't select text SPAN node
        var top = parseInt(el.style.top) || 0;
        var left = parseInt(el.style.left) || 0;
        this.setState({ isDragging: true, orig: { x: e.pageX - left, y: e.pageY - top} });
    }
    handleDrag(id, height, width, e) {
        if (this.state.isDragging) {
            this.props.updateShape(id, e.pageY - this.state.orig.y, e.pageX - this.state.orig.x);
        }
    }
}

export default connect(
    (state) => ({ shapes: state.shapes }), 
    (dispatch) => ({
        updateShape: (id, top, left) => dispatch({ type:'SHAPE_CHANGE', id, top, left})
    })
)(ShapeViewer);
```

When Shapes have been added, ShapeViewer renders them into an empty div container: 

![](https://raw.githubusercontent.com/ServiceStackApps/typescript-redux/master/img/shapes-viewer.png)

### Dragging shapes to generate actions

In addition to viewing all shapes ShapeViewer also includes support for moving and updating a shape's position 
as it's a fast way to generate a lot of Actions quickly that ends up being a great way to visualize and replay 
a series of state transitions. 

> For simplicity we're using mouseover events instead of the proper drag and drop API's for this so you'll 
need to start off dragging slowly, making the shape bigger also helps increases the target area.

### [ActionPlayer.tsx](https://github.com/ServiceStackApps/typescript-redux/blob/master/src/TypeScriptRedux/src/example07/ActionPlayer.tsx)

Now that we've effectively covered all our Apps functionality we can start flexing some Redux muscles. 

#### replayActions

If we've built our App correctly we should in theory be able to replay our entire App session by resetting our 
Redux store back to its default state and replaying each action sent, which is exactly what `replayActions` 
does, albeit slowly, with each action replayed 10ms apart to give the illusion of time:

```typescript
import * as React from 'react';

export default class ActionPlayer extends React.Component<any, any> {
    private unsubscribe: Function;
    componentDidMount() {
        this.unsubscribe = this.props.store.subscribe(() => this.forceUpdate());
    }
    componentWillUnmount() {
        this.unsubscribe();
    }
    render() {
        return (
            <div>
                <button onClick={e => this.replayActions()}>replay</button>
                <p>
                    <b>{this.props.actions.length}</b> actions
                </p>
                <button onClick={e => this.undoAction()}>undo</button> <span></span>
                <button onClick={e => this.resetState()}>clear</button>
            </div>
        );
    }
    resetState() {
        this.props.store.dispatch({ type: 'LOAD', state: this.props.defaultState });
        this.props.actions.length = 0;
    }
    replayActions() {
        var snapshot = this.props.actions.slice(0);
        this.resetState();

        snapshot.forEach((action, i) =>
            setTimeout(() => this.props.store.dispatch(action), 10 * i));
    }
    undoAction() {
        var snapshot = this.props.actions.slice(0, this.props.actions.length - 1);
        this.resetState();
        snapshot.forEach(action => this.props.store.dispatch(action));
    }
}
```

ActionPlayer also displays the number of Actions sent:

![](https://raw.githubusercontent.com/ServiceStackApps/typescript-redux/master/img/shapes-actions.png)

#### resetState

Clearing our App back to its original state doesn't get much easier, just load the apps `defaultState` and
clear the saved actions. 

#### undoAction

If the only thing our App captured were actions sent then we'll need to resort to an inefficient poor man's 
Undo of just replaying back every action except the last one. Fortunately thanks to the JavaScript VM 
performance wars this work is usually instant - making it look like we've implemented it properly :)

### [app.tsx](https://github.com/ServiceStackApps/typescript-redux/blob/master/src/TypeScriptRedux/src/example07/app.tsx)

After having implemented all the modules that make up our App, the only things left is the parent Container 
glue hosting all parts together and our Redux reducer function, implementing all action state transitions.

### Application Reducers

The implementation of the reducer function is typical for that of a Redux app with a switch statement to 
handle each action type. Without Babel's spread object operator, ES6's `Object.assign()` is the next best
thing, merging properties from multiple objects together into the first argument with properties on the right 
taking highest precedence. By using a new `{}` object for our merge target we avoid mutating existing objects
and maintain Redux's immutability contract. Although it's worth pointing out that we don't need immutability 
at this stage, our App would still function the same (including Action replay) if our reducer mutated 
existing state provided that we reset with a new defaultState object. Although there are performance, 
utility and predictability benefits for retaining immutability so it's still something you'll want to adhere to. 

A benefit of Redux single App state model is visible from the trivial implementation required to **LOAD** our 
application to a given state:

```typescript
case 'LOAD':
    return action.state;
```

Showing we don't need a special Redux function to do this, we can simply have our reducer return our desired 
state that we can pass as a normal argument in our action message.

```typescript
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';

import Counter from './Counter';
import ActionPlayer from './ActionPlayer';
import ShapeMaker from './ShapeMaker';
import ShapeViewer from './ShapeViewer';
import { ColorPicker } from './ColorPicker';

var actions = [];
var defaultState = { nextShapeId:0, width: 100, height: 100, color:"#000000", shapes:[] };

let store = createStore(
    (state, action) => {
        actions.push(action);
        switch (action.type) {
            case 'COUNTER_CHANGE':
                return Object.assign({}, state, { [action.field]: state[action.field] + action.by });
            case 'COLOR_CHANGE':
                return Object.assign({}, state, { color: action.color });
            case 'SHAPE_ADD':
                var id = state.nextShapeId;
                var shape = Object.assign({}, { id: id }, action);
                delete shape['type'];
                return Object.assign({}, state, { nextShapeId: id + 1, shapes: [...state.shapes, shape] });
            case 'SHAPE_CHANGE':
                var shape = Object.assign({}, state.shapes.filter(x => x.id === action.id)[0],
                    { top: action.top, left: action.left });
                return Object.assign({}, state,
                    { shapes: [...state.shapes.filter(x => x.id !== action.id), shape] });
            case 'LOAD':
                return action.state;
            default:
                return state;
        }
    },
    defaultState);

class ColorWrapperBase extends React.Component<any,any> {
    render() {
        return <ColorPicker color={this.props.color} onChange={this.props.setColor} />;
    }
}

const ColorWrapper = connect(
    (state) => ({ color: state.color }),
    (dispatch) => ({ setColor: (color) => dispatch({ type:'COLOR_CHANGE', color })})
)(ColorWrapperBase);

ReactDOM.render(
    <Provider store={store}>
        <table>
            <tbody>
            <tr>
                <td style={{ width: 220 }}>
                    <Counter field="width" step={10} />
                    <Counter field="height" step={10} />
                    <ColorWrapper />
                </td>
                <td style={{verticalAlign:"top", textAlign:"center", width:500}}>
                    <h2>Preview</h2>
                    <ShapeMaker />
                </td>
                <td style={{ verticalAlign: 'bottom' }}>
                    <ActionPlayer store={store} actions={actions} defaultState={defaultState} />
                </td>
            </tr>
            <tr>
                <td colSpan={3}>
                    <h2 style={{margin:5,textAlign:'center'}}>Shapes</h2>
                    <ShapeViewer />
                </td>
            </tr>
            </tbody>
        </table>
    </Provider>,
    document.getElementById("content"));
```

And with that we have a working Shape Creator in its entirety:


[![](https://raw.githubusercontent.com/ServiceStackApps/typescript-redux/master/img/preview-07.png)](http://servicestackapps.github.io/typescript-redux/example07/)
> Demo: [/typescript-redux/example07/](http://servicestackapps.github.io/typescript-redux/example07/)

One point worth highlighting is that our top-level App is only ever rendered once as it's not contained
within a parent component using `setState()` to modify state and trigger re-rendering. As a result we need
to wrap our ColorPicker into a Redux-aware ColorWrapper which also maps our Redux state to its Component 
properties as well as translating the `onChange` callback into dispatching the appropriate Redux action.

## Refactoring Reducers

There are a few areas in the classic Redux implementation above I believe we can improve upon with some 
light refactoring and use of TypeScript's advanced language features. First thing on the refactor list is the
large `switch` statement whose tight coupling and multiple exit points need eliminating:

```typescript
let store = createStore(
    (state, action) => {
        actions.push(action);
        switch (action.type) {
            case 'COUNTER_CHANGE':
                return Object.assign({}, state, { [action.field]: state[action.field] + action.by });
            case 'COLOR_CHANGE':
                return Object.assign({}, state, { color: action.color });
            case 'SHAPE_ADD':
                var id = state.nextShapeId;
                var shape = Object.assign({}, { id: id }, action);
                delete shape['type'];
                return Object.assign({}, state, { nextShapeId: id + 1, shapes: [...state.shapes, shape] });
            case 'SHAPE_CHANGE':
                var shape = Object.assign({}, state.shapes.filter(x => x.id === action.id)[0],
                    { top: action.top, left: action.left });
                return Object.assign({}, state,
                    { shapes: [...state.shapes.filter(x => x.id !== action.id), shape] });
            case 'LOAD':
                return action.state;
            default:
                return state;
        }
    },
    defaultState);
```

Instead of using Redux built-in 
[combineReducers](http://rackt.org/redux/docs/api/combineReducers.html) for helping with modularity,
my preference is to instead use a dictionary of action functions which I believe is the more readable and 
flexible option. In the refactor I've also extracted reducers into a separate module, decoupling it from 
**app.tsx**:

```typescript
import reducers from './reducers';
...

let store = createStore(
    (state, action) => {
        var reducer = reducers[action.type];
        var nextState = reducer != null
            ? reducer(state, action)
            : state;

        if (action.type !== 'LOAD')
            history.add(action, nextState);

        return nextState;
    },
    defaultState);
```

#### [reducers.ts](https://github.com/ServiceStackApps/typescript-redux/blob/master/src/TypeScriptRedux/src/example08/reducers.ts)

The **reducers** module then just returns an object dictionary of action types and their respective implementations:

```typescript
import { addShape, changeShape } from './reducers/shapeReducers';

const changeCounter = (state, action) =>
    Object.assign({}, state, { [action.field]: state[action.field] + action.by });

const changeColor = (state, action) =>
    Object.assign({}, state, { color: action.color });

export default {
    COUNTER_CHANGE: changeCounter,
    COLOR_CHANGE: changeColor,
    SHAPE_ADD: addShape,
    SHAPE_CHANGE: changeShape,
    LOAD: (state, action) => action.state
};
```

Named functions improves readability and lets you develop and test each reducer implementation in isolation. 
This approach also scales well as we can further modularize related reducers into cohesive modules as done in: 

#### [shapeReducers.ts](https://github.com/ServiceStackApps/typescript-redux/blob/master/src/TypeScriptRedux/src/example08/reducers/shapeReducers.ts)

```typescript
export const addShape = (state, action) => {
    var id = state.nextShapeId;
    var shape = Object.assign({}, { id: id }, action);
    delete shape['type'];
    return Object.assign({}, state, { nextShapeId: id + 1, shapes: [...state.shapes, shape] });
};

export const changeShape = (state, action) => {
    var shape = Object.assign({}, state.shapes.filter(x => x.id === action.id)[0],
        { top: action.top, left: action.left });
    return Object.assign({}, state, { shapes: [...state.shapes.filter(x => x.id !== action.id), shape] });
};
```

## Refactoring Redux Components

There's also a few things we can do to improve on the Redux-connected Components which currently uses an 
imperative `connect()` method to create our higher-level Redux-connected Components:

```typescript
class ColorWrapperBase extends React.Component<any,any> {
    render() {
        return <ColorPicker color={this.props.color} onChange={this.props.setColor} />;
    }
}

const ColorWrapper = connect(
    (state) => ({ color: state.color }),
    (dispatch) => ({ setColor: (color) => dispatch({ type:'COLOR_CHANGE', color })})
)(ColorWrapperBase);
```

I dislike how implementations are disconnected from the Component's class declaration it applies to, 
how it needs to be defined after the class declaration instead of above to match how it conceptually works. 

If we instead extracted the implementations into separate `mapStateToProps` and `mapDispatchToProps` named 
functions it adds readability but then creates even more moving parts and naming clashes making it harder 
to reuse the same recipe for creating other Redux Components in the same file.

The `connect()` method is also an imperatively unnatural way to define a new Component which otherwise uses 
class declarations. It's also less readable where the source code reads as: 

> Use connect() to return a Factory constructor function that needs to be immediately invoked with your base 
Component to return a new Component that replaces your existing Component which is now an interim artifact 
to be disregarded.

### TypeScript Decorators

Whilst it's still workable, there's a better way to create Redux Components by leveraging the 
[Decorators proposal](https://github.com/wycats/javascript-decorators/blob/master/README.md) that's an
available feature that can be enabled with the `experimentalDecorators` TypeScript compiler option. 
Currently there's no UI for this option in Visual Studio, so to enable it you'll need to edit your `.csproj` 
and add the option manually:

```xml
<TypeScriptExperimentalDecorators>true</TypeScriptExperimentalDecorators>
```

When enabled this lets you create and use decorators that despite being simple functions provide an easy way 
to compose behavior, dramatically reduce repetitive boilerplate and improve readability as seen with the 
[@reduxify()](https://github.com/ServiceStackApps/typescript-redux/blob/661f9fcc1ce6c4a7b66064ce3511033d37a26d99/src/TypeScriptRedux/src/example08/core.ts#L18)
decorator which just delegates to Redux connect():

```typescript
export function reduxify(mapStateToProps?: MapStateToProps,
    mapDispatchToProps?: MapDispatchToPropsFunction | MapDispatchToPropsObject) {
    return target => connect(mapStateToProps, mapDispatchToProps)(target);
}
```

With just this simple change we get the ideal declarative API we want for defining Redux-connected Components 
which are now defined in a single unit, with property mapping functions declared above the class declaration 
and all interim artifacts abstracted away:

```typescript
@reduxify(
    (state) => ({ color: state.color }),
    (dispatch) => ({ setColor: (color) => dispatch({ type: 'COLOR_CHANGE', color }) })
)
class ColorWrapper extends React.Component<any,any> {
    render() {
        return <ColorPicker color={this.props.color} onChange={this.props.setColor} />;
    }
}
```

### Methods with Lexical bindings

Something that can have a dramatic performance improvement in React Apps is the 
[PureRenderMixin](https://facebook.github.io/react/docs/pure-render-mixin.html) which prevents unnecessary
re-rendering of a Component by checking to see if the props or state of a pure Component has changed. 
Incidentally this is something that Redux `connect()` provides automatically that thanks to immutability is 
able to do a shallow and faster object reference comparison to determine if state has changed and a Component 
needs updating.

Something that can break identity comparisons are function callbacks in ES6 classes as in order to retain
lexical `this` binding, we'd need to use the 
[fat arrow syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
at the call-site:

```typescript
export class NumberPicker extends React.Component<any, any> {
    render() {
        return (
            <p>
                <input type="range" value={this.props.value.toString()} min="0" max="255"
                    onChange={e => this.handleChange(e)} /> //new function created
                <label> {this.props.name}: </label>
                <b>{ this.props.value }</b>
            </p>
        );
    }
    handleChange(event) {
        const e = event.target as HTMLInputElement;
        this.props.onChange(parseInt(e.value));
    }
}
``` 

The problem with this is that a new 
[function identity](https://medium.com/@esamatti/react-js-pure-render-performance-anti-pattern-fb88c101332f#9bed)
is created each time invalidating property comparisons and potential Pure Render optimizations. 

An easy workaround is to use the fat arrow syntax when defining your methods:

```typescript
export class NumberPicker extends React.Component<INumberProps, any> {
    render() {
        return (
            <p>
                <input type="range" value={this.props.value.toString()} min="0" max="255"
                    onChange={this.handleChange} /> //uses same function
                <label> {this.props.name}: </label>
                <b>{this.props.value}</b>
            </p>
        );
    }
    handleChange = (event) => { //fat arrow syntax
        const e = event.target as HTMLInputElement;
        this.props.onChange(parseInt(e.value));
    }
}
```

`handleChange` now retains lexical `this` references allowing the same instance to be safely used.

## [Example 8 - Time Travelling using State Snapshots](https://github.com/ServiceStackApps/typescript-redux/tree/master/src/TypeScriptRedux/src/example08)

In this example we'll replace `ActionPlayer` with a more complete implementation using App state snapshots. 
By using state we can implement richer History functionality complete with back, forward and any point in time 
navigation that we can fluently control with a slider enabling a "Time Travelling" experience to simulate
going back and forward throughout an App's users session.

To make it more reusable the history state management is encapsulated behind a formal API with basic operations
to navigate, reset and push the current state that gets added to by our reducer:

#### [app.tsx](https://github.com/ServiceStackApps/typescript-redux/blob/master/src/TypeScriptRedux/src/example08/app.tsx)

```typescript
var history = {
    states: [],
    stateIndex: 0,
    reset() {
        this.states = [];
        this.stateIndex = -1;
    },
    prev() { return this.states[--this.stateIndex]; },
    next() { return this.states[++this.stateIndex]; },
    goTo(index) { return this.states[this.stateIndex=index]; },
    canPrev() { return this.stateIndex <= 0; },
    canNext() { return this.stateIndex >= this.states.length - 1; },
    pushState(nextState) {
        this.states.push(nextState);
        this.stateIndex = this.states.length - 1;
    }
};

let store = createStore(
    (state, action) => {
        var reducer = reducers[action.type];
        var nextState = reducer != null
            ? reducer(state, action)
            : state;

        if (action.type !== 'LOAD')
            history.pushState(nextState);

        return nextState;
    },
    defaultState);
```

#### [History.tsx](https://github.com/ServiceStackApps/typescript-redux/blob/master/src/TypeScriptRedux/src/example08/History.tsx)

By saving and restoring entire state snapshots the implementation for our History control becomes surprisingly 
straight-forward, essentially it comes down to dispatching a **LOAD** action with the desired state:

```typescript
@subscribeToStore()
export default class History extends React.Component<any, any> {
    render() {
        return (
            <div>
                <button onClick={this.replayStates}>replay</button>
                <span> </span>
                <button onClick={this.resetState}>clear</button>
                <p>
                    <b>{this.props.history.states.length}</b> states
                </p>
                <button onClick={this.prevState} disabled={this.props.history.canPrev()}>prev</button>
                <span> </span>
                <button onClick={this.nextState} disabled={this.props.history.canNext()}>next</button>
                <p>
                    <b>{this.props.history.stateIndex + 1}</b> position
                </p>
                <input type="range" min="0" max={this.props.history.states.length - 1}
                    disabled={this.props.history.states.length === 0}
                    value={this.props.history.stateIndex} onChange={this.goToState} />
            </div>
        );
    }
    resetState = () => {
        this.props.store.dispatch({ type: 'LOAD', state: this.props.defaultState });
        this.props.history.reset();
    }
    replayStates = () => {
        this.props.history.states.forEach((state, i) =>
            setTimeout(() => this.props.store.dispatch({ type: 'LOAD', state }), 10 * i));
    }
    prevState = () => {
        this.props.store.dispatch({ type: 'LOAD', state: this.props.history.prev() });
    }
    nextState = () => {
        this.props.store.dispatch({ type: 'LOAD', state: this.props.history.next() });
    }
    goToState = (event) => {
        const e = event.target as HTMLInputElement;
        this.props.store.dispatch({ type: 'LOAD', state: this.props.history.goTo(parseInt(e.value)) });
    }
}
```

Our Example now sports richer History capabilities complete with a fun "Time Travelling" slider :)

[![](https://raw.githubusercontent.com/ServiceStackApps/typescript-redux/master/img/preview-08.png?)](http://servicestackapps.github.io/typescript-redux/example08/)
> Demo: [/typescript-redux/example08/](http://servicestackapps.github.io/typescript-redux/example08/)

### [Implementing Undo History](http://rackt.org/redux/docs/recipes/ImplementingUndoHistory.html)

If you're adding undo/redo functionality to your Redux applications you're more likely going to want to apply
it to independent parts of your application rather than rolling back your entire App's state, luckily the 
[redux docs have you covered](http://rackt.org/redux/docs/recipes/ImplementingUndoHistory.html)
with an example inspired by Elm's [undo-redo package](http://package.elm-lang.org/packages/TheSeamau5/elm-undo-redo/2.0.0).

## [Example 9 - Real-time Networked Time Traveller](https://github.com/ServiceStackApps/typescript-redux/tree/master/src/TypeScriptRedux/src/example09)

Loading Redux Snapshots as seen in the previous example illustrates some of the natural capabilities available 
when adopting a data-flow architecture like Redux - utilizing simple actions for transitioning between 
immutable states. 

### Saving and Restoring App State

A major benefit of maintaining both state and actions in plain JavaScript objects we've yet to explore is how 
they're naturally serializable. The obvious benefit is that the entire Application state can be trivially 
saved and restored from localStorage, maintaining a user's session across multiple browser restarts:

```javascript
//Save App State
localStorage.setItem("appState", JSON.stringify(store.getState()));

//Restore App State
let store = createStore(rootReducer, 
    JSON.parse(localStorage.getItem("appState")) || defaultState);
```

### Transferring State over a Network

Another example of the benefits is how easy it would be to transfer your application state to other users over 
a network. Actions are similar to diffs, i.e. minimal instructions capturing change between different states. 
So in theory we could just stream the actions to users over a network and they will be able to see changes we 
make in real-time. 

Adding support for this ends up being fairly trivial, the main architectural hurdle is how can we communicate
between users over HTTP in real-time. In desktop apps we can establish a direct network connection, but on a 
website, communications need to go via a central server. There are a few ways to enable real-time communications
over a website: polling, web sockets and server sent events. Of these options 
[Server Sent Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events)
offers a 
[simple, efficient and natural fit for HTTP](https://github.com/ServiceStack/ServiceStack/wiki/Server-Events) 
which we'll utilize here.

#### Example Objectives

Our objectives for this example is to provide a list of active users currently viewing the website that we 
want to enable other users to be able to **Connect** to and be able to **watch** what they're doing, i.e. 
similar to Remote Desktop into another computer's screen. Conceptually for this to work we just need to load a 
user's **initial state** then **listen** to a **stream of their actions** (generated as they're using the app). 
We also want to allow users to **disconnect** from a user's session and take over from where they left off.

#### Implementation utilizing Server Events

To enable this we'll have every user listen to a common **home** channel that we can query to find active
users and get notified as new users come and go. We'll then have each user re-publish a stream of their 
actions on their own **user channel** which multiple users can listen on to receive a stream of their actions.
To disconnect they can just unsubscribe from the **users channel**. Finally since the user's state is 
maintained in a Redux store (in their browser and not on the server) we also need to facilitate communication 
between users which we enable by sending a **direct message** to a user who can **reply** via a direct message 
back, with their current state.

Surprisingly most of the code to make this happen is encapsulated within the React `<Connect />` component below:

```typescript
/// <reference path='../../typings/browser.d.ts'/>

import * as React from 'react';
import { connect } from 'react-redux';
import { reduxify } from './core';
import 'jquery';
import 'ss-utils';

declare var EventSource:ssutils.IEventSourceStatic;

export default class Connect extends React.Component<any, any> {

    constructor(props?, context?) {
        super(props, context);
        this.state = {
            channels: ["home"], currentUser: null, users: [], 
            connectedToUserId: null, connectedUserActions: [], connectedStateIndex: -1
        };
        var source = new EventSource(serverEventsUrl());
        $(source).handleServerEvents({
            handlers: {
                onConnect: (currentUser) => {
                    currentUser.usersChannel = userChannel(currentUser.userId);
                    this.setState({currentUser, users: filterUsers(this.state.users,currentUser.userId)});
                    this.props.onConnect(currentUser);
                },
                onJoin: () => this.refreshUsers(),
                onLeave: () => this.refreshUsers(),
                onUpdate: (user) => this.setState({
                     users: this.state.users.map(x => x.userId === user.userId ? user : x)
                }), 
                getState: (json, e) => {
                    var o = JSON.parse(json);
                    var index = o.stateIndex || this.props.history.stateIndex;
                    var state = this.props.history.states[index];
                    $.ss.postJSON(`/send-user/${o.replyTo}?selector=cmd.onState`, state);
                },
                onState: (json, e) => {
                    this.props.store.dispatch({ 
                        type:'LOAD', state:json ? JSON.parse(json) : this.props.defaultState });
                },
                publishAction: (json, e) => {
                    var action = JSON.parse(json);
                    this.props.store.dispatch(action);
                }
            }
        });
    }

    render() {
        if (this.state.currentUser == null) return null;
        return (
            <div>
                <div style={{fontWeight:"bold"}}>
                    {this.renderUser(this.state.currentUser)}
                </div>
                <div style={{padding:"8px 0", textAlign:"center", fontSize:"18px"}}>
                    {this.state.users.length} users online:
                </div>
                
                { this.state.users.map(u => this.renderUser(u)) }

                <div style={{textAlign:"center", padding:"10px 0"}}>
                    { this.state.connectedToUserId ? <button onClick={e => this.disconnect()}>disconnect</button> : null}
                </div>
            </div>
        );
    }

    renderUser(u) {
        return (
            <div key={u.userId} onClick={e => this.connectToUser(u.userId)} style={{
                cursor:"pointer", padding:"4px",
                background:u.userId === this.state.connectedToUserId ? "#ffc" :  ""
            }}>
                <img src={u.profileUrl} style={{height:24,verticalAlign:"middle"}} />
                <span style={{padding:"2px 5px" }}>
                    {u.displayName} {u.userId === this.state.currentUser.userId ? " (me)" : ""}
                </span>
            </div>
        );
    }

    connectToUser(userId) {
        if (userId === this.state.currentUser.userId) return;

        this.requestUsersState(userId);
        var connectedChannels = this.state.channels.filter(x => x !== "home");
        $.ss.updateSubscriber({
            SubscribeChannels: userChannel(userId), 
            UnsubscribeChannels: connectedChannels.join(',')
        }, r => {
            this.setState({
                channels:r.channels, 
                connectedToUserId: userId
            });
        });
    }

    disconnect() {
        $.ss.unsubscribeFromChannels([userChannel(this.state.connectedToUserId)]);
        this.setState({ connectedToUserId: null });
    }

    requestUsersState(userId) {
        return $.ss.postJSON(`/send-user/${userId}?selector=cmd.getState`,
            { replyTo: this.state.currentUser.userId });
    }

    refreshUsers() {
        $.getJSON("/event-subscribers?channels=home", users => {
            this.setState({ users:filterUsers(users, this.state.currentUser.userId) });
        });
    }
}

const userChannel = (userId) => "u_" + userId; 

const filterUsers = (users, userId) => 
    users.filter(x => x.userId !== userId).sort((x,y) => x.userId.localeCompare(y.userId));
```

We'll go through some of the core parts to explain how this works. For the Server implementation we'll
use ServiceStack's 
[Server Events](https://github.com/ServiceStack/ServiceStack/wiki/Server-Events) 
which includes an easy to use
[JavaScript Client](https://github.com/ServiceStack/ServiceStack/wiki/JavaScript-Server-Events-Client)
that simplifies the effort required to process Server Events.

ServiceStack Server Events doesn't expose any APIs for publishing messages to users out-of-the-box, instead 
access needs to be controlled by explicit Services. For this example we need a back-end Service that lets users 
publish their actions to a channel and another Service to send a direct message to a User. The 
[entire implementation](https://github.com/ServiceStackApps/typescript-redux/blob/master/src/TypeScriptRedux/Global.asax.cs)
for both these services are below: 

```csharp
//Services Contract
[Route("/publish-channel/{Channel}")]
public class PublishToChannel : IReturnVoid, IRequiresRequestStream
{
    public string Channel { get; set; }
    public string Selector { get; set; }
    public Stream RequestStream { get; set; }
}

[Route("/send-user/{To}")]
public class SendUser : IReturnVoid, IRequiresRequestStream
{
    public string To { get; set; }
    public string Selector { get; set; }
    public Stream RequestStream { get; set; }
}

//Services Implementation
public class ReduxServices : Service
{
    public IServerEvents ServerEvents { get; set; }

    public void Any(PublishToChannel request)
    {
        var msg = request.RequestStream.ReadFully().FromUtf8Bytes();
        ServerEvents.NotifyChannel(request.Channel, request.Selector, msg);
    }

    public void Any(SendUser request)
    {
        var msg = request.RequestStream.ReadFully().FromUtf8Bytes();
        ServerEvents.NotifyUserId(request.To, request.Selector, msg);
    }
}
```

Essentially just using the `IServerEvents` dependency to forward the JSON Request Body to the specified 
channel or user.

### Connecting to Server Events

The JavaScript client to connect to Server Events is in the `ss-utils` npm package which we can install with:

    C:\proj> jspm install ss-utils

Then import the type definitions with:

    C:\proj> typings install ss-utils --ambient --save

As there are no built-in type definitions for HTML 5's 
[EventSource](https://developer.mozilla.org/en-US/docs/Web/API/EventSource) the easiest way to make use of it
in TypeScript is to use the definition in ss-utils which we declare with:

```typescript
declare var EventSource:ssutils.IEventSourceStatic;
```

To make a server connection we configure the `EventSource` object with the url of the server events stream.
ServiceStack also lets you specify any initial channels you want to connect to with a queryString:

```typescript
var source = new EventSource("/event-stream?channels=home");
```

Then we use ss-utils `handleServerEvents()` jQuery function to connect to the event stream and handle any events.
The first 4 events are automatically available by ServiceStack, for notifying when:

  - **onConnect** - you've connected to the server event stream
  - **onJoin** - a user has joined a channel you're subscribed to
  - **onLeave** - a user has left a channel you're subscribed to
  - **onUpdate** - an existing user has changed the channels they've subscribed to

The remaining handlers are for application events used in this example to handle when:

  - **getState** - we're requested for our current state
  - **onState** - the user we're connected to responds with their state
  - **publishAction** - the user we're connected to publishes an action

```typescript
$(source).handleServerEvents({
    handlers: {
        //Built-in subscription Life-cycle events
        onConnect: (currentUser) => {
            currentUser.usersChannel = userChannel(currentUser.userId);
            this.setState({currentUser, users: filterUsers(this.state.users,currentUser.userId)});
            this.props.onConnect(currentUser);
        },
        onJoin: () => this.refreshUsers(),
        onLeave: () => this.refreshUsers(),
        onUpdate: (user) => this.setState({
            users: this.state.users.map(x => x.userId === user.userId ? user : x)
        }),

        //If we receive a request for our state, send a reply with our current state
        getState: (json, e) => {
            var o = JSON.parse(json);
            var index = o.stateIndex || this.props.history.stateIndex;
            var state = this.props.history.states[index];
            $.ss.postJSON(`/send-user/${o.replyTo}?selector=cmd.onState`, state);
        },
        
        //When we receive state reply from our connected user, load it         
        onState: (json, e) => {
            this.props.store.dispatch({ 
                type:'LOAD', state:json ? JSON.parse(json) : this.props.defaultState });
        },
        
        //When we receive an action from the connected user, forward it to the redux store
        publishAction: (json, e) => {
            var action = JSON.parse(json);
            this.props.store.dispatch(action);
        }
    }
});
```

To maintain an active users list, we query the event subscribers that are connected to the **home** channel 
(that everyone is initially connected to) with:

```typescript
refreshUsers() {
    $.getJSON("/event-subscribers?channels=home", users => {
        this.setState({ users: filterUsers(users, this.state.currentUser.userId) });
    });
}

//Exclude ourselves from the returned list and order the users by their id
const filterUsers = (users, userId) => 
    users.filter(x => x.userId !== userId).sort((x,y) => x.userId.localeCompare(y.userId));
```

To **connect** to a user, we first request their initial state then update our current server events 
subscription to join the new **users channel**. If we we're connected to an existing user we also want to 
unsubscribe from their users channel at the same time:

```typescript
connectToUser(userId) {
    if (userId === this.state.currentUser.userId) return;

    this.requestUsersState(userId);
    var connectedChannels = this.state.channels.filter(x => x !== "home");
    $.ss.updateSubscriber({
        SubscribeChannels: userChannel(userId), 
        UnsubscribeChannels: connectedChannels.join(',')
    }, r => {
        this.setState({
            channels:r.channels, 
            connectedToUserId: userId
        });
    });
}

const userChannel = (userId) => "u_" + userId; 
```

To request a user's state we call the `SendUser` back-end service with the `userId` we want to send to,
the `getState` handler we want to invoke and add pass our userId in the `replyTo` property of the message
request body:

```typescript
requestUsersState(userId) {
    return $.ss.postJSON(`/send-user/${userId}?selector=cmd.getState`,
        { replyTo: this.state.currentUser.userId });
}
```

The last feature to implement is disconnecting from a user which just involves unsubscribing from their 
users channel and updating our state:

```typescript
disconnect() {
    $.ss.unsubscribeFromChannels([userChannel(this.state.connectedToUserId)]);
    this.setState({ connectedToUserId: null });
}
```

That's it for the core functionality! The only other change needed is to refactor our Redux store to
publish each action we create to our **users channel** so it applies the action to all our connected users.

As this is a network side-effect we want to keep it out of our reducer implementation and make it a pure
function. The recommended way to do this is to use 
[Redux middleware](http://redux.js.org/docs/advanced/Middleware.html)
which lets you generically handle updates to the Redux store:

```typescript
var currentUser;
const onConnect = (user) => currentUser = user;

const updateHistory = store => next => action => {
    var result = next(action);

    if (action.type !== 'LOAD') {
        history.pushState(store.getState());
    }

    $.ss.postJSON(`/publish-channel/${currentUser.usersChannel}?selector=cmd.publishAction`, action);

    return result;
};

let store = createStore(
    (state, action) => {
        var reducer = reducers[action.type];
        var nextState = reducer != null
            ? reducer(state, action)
            : state;

        return nextState;
    },
    defaultState,
    applyMiddleware(updateHistory));
```

There's currently an [outstanding issue with redux TypeScript definition](https://github.com/reactjs/redux/pull/1413)
that makes the method signature of `applyMiddleware` incompatible with what `createStore` accepts. Until
a new TypeScript definition is released you'll need to manually edit `typings/browser/ambient/redux/redux.d.ts`
and replace the applyMiddleware definition from:

    function applyMiddleware(...middlewares: Middleware[]): Function;

to:

    function applyMiddleware(...middlewares: Middleware[]): () => any;


And with that we're done, we've now converted Shape Creator into a networked time traveller letting us connect
to active users and watch their live session in real-time - the Time Slider is now x Connected Users more fun :)

[![](https://raw.githubusercontent.com/ServiceStackApps/typescript-redux/master/img/preview-09.png)](http://redux.servicestack.net)
> Demo: [http://redux.servicestack.net](http://redux.servicestack.net)

## JSPM Bundling for Production

One of the nice features of using JSPM is that it's also able to bundle your entire applicaton using your 
declared module dependencies, saving having to repeat and manage this information in an external bundler tool. 

To package your App for production run `jspm bundle` on your main app with the `-m` flag to minify your 
application, e.g we can package our last example with: 

    C:\proj> jspm bundle -m src/example09/app app.js 

JSPM still requires the `system.js` module loader and your local JSPM `config.js` which maintains your 
installed npm dependencies. The resulting `index.html` then becomes a container for our compiled application:

```html
<html>
<head>
    <title>TypeScript + JSPM + React + Redux</title>
    <script src="jspm_packages/system.js"></script>
    <script src="config.js"></script>
    <script src="app.js"></script>
</head>
<body>
    <h1>Redux Shape Creator</h1>
    <div id="content"></div>

    <script>
        System.import("./src/example09/app");
    </script>
</body>
</html>
```

## [ServiceStack TypeScript React VS.NET Template](https://github.com/ServiceStackApps/typescript-react-template/)

As the technologies used in this guide represent today's best-in-class choices for developing rich, complex
JavaScript Apps within VS.NET, we've encapsulated them together into ServiceStack's new
[TypeScript React VS.NET Template](https://github.com/ServiceStackApps/typescript-react-template/)
providing an instant integrated client and .NET server solution so you're immediately productive out-of-the-box. 
It's also provides an optimal iterative development experience with the pre-configured Gulp tasks taking care of 
effortlessly packaging, bundling and deploying your production-optimized App 
[directly from VS.NET's Task Runner Explorer](https://github.com/ServiceStackApps/typescript-react-template/#networkedshapecreator-project). 

## Feedback

We hope you've found this guide useful and it helps spur some ideas of what you can create with these simple 
and powerful technologies in your next App. We welcome any enhancements via pull-requests, otherwise feel free
to drop feedback to [@demisbellot](https://twitter.com/demisbellot). 


  [1]: https://webpack.github.io
  [2]: https://segmentfault.com/a/1190000002551952
  [3]: https://zhongsp.gitbooks.io/typescript-handbook/content/doc/handbook/quick-start/react-webpack.html
  [4]: http://webpack.github.io/docs/configuration.html
  [5]: http://cn.redux.js.org
  [6]: https://github.com/react-guide/redux-tutorial-cn