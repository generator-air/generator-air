generator-air —— 有态度、有质量、无重量的脚手架生成器。

# 一、设计思想
我们的基本原则：轻量、轻量、轻量。
我们的态度：在保证脚手架轻量、易学习、好上手的基本原则下，尽最大可能为您提供节省开发成本的内置模块以及各种工具，提升开发效率。
我们的愿景：让开发者用最低的学习成本，获取最高的开发效率。
我们的目标：确保为您提供的每一款脚手架，都足够精致。

# 二、快速上手
## 1.安装
```shell
npm install -g generator-air
```
## 2.使用
任意目录下（如：tmp目录）执行：
```shell
yo air
```
&nbsp;
根据提示，按需选择。
// 配每一步的截图及说明（特别是模板是否覆盖那里）
## 3.启动测试
进入刚刚创建的项目根目录，执行：
```shell
npm run dev
```
&nbsp;
出现下图，则启动成功：
![image](./readmeImgs/npm_run_dev.png)
&nbsp;
启动成功后，浏览器访问 localhost:8090
![image](./readmeImgs/home.png)

# 三、各款脚手架介绍
## · 管理端-vue（已支持）
### 1.技术栈：vue + element-ui
### 2.启动效果：
![image](./readmeImgs/home.png)
### 3.目录结构：
```javascript
├── babel.config.js
├── config.js   // 项目构建相关配置文件。如cdn上传路径等
├── gulpfile.js
├── package.json
├── public   // 页面模板
|  ├── favicon.ico
|  └── index.html
├── src   // 源代码
|  ├── App.vue          // 根组件
|  ├── assets             // 静态资源文件夹（图片、icon、css）
|  ├── components    // 自定义组件
|  |  ├── global         // 全局用组件（logo、svgIcon等）
|  |  ├── list             // 列表页用组件（table、pagination、search、filter）
|  |  └── nav           // 布局用组件（navHead、navSide）
|  ├── main.js   // 主入口
|  ├── mixin      // 自定义的一些插件，为Vue增加全局/原型方法
|  ├── model     // 用于存放一些字典类的文件
|  ├── pages      // 页面管理
|  ├── router     // 路由配置
|  ├── util         // 存放项目逻辑用的工具方法
|  └── vuex      // vuex使用demo
├── tools          // 用于项目创建的工具方法（命令行使用的方法。为提高开发者开发效率提供）
|  ├── answersStore.js
|  ├── pageCreate.js   // 页面创建工具（yarn page）
|  └── routeCreate.js   // 路由创建工具（yarn route）
├── vue.config.js
└── yarn.lock
```
### 4.快速开始
（从页面创建开始，到路由创建，到完成一个接口的调用、开发）
### 5.功能模块讲解（// 功能、设计思想介绍 + 使用方式详述）
#### 5.1 用户权限
##### 5.1.1 第三方登录场景
（1）整体流程
![image](./readmeImgs/login_flow.png)
（2）用户信息管理
（3）权限管理
#####  5.1.2 本系统登录场景
（1）整体流程
（2）用户信息管理
（3）权限管理

#### 5.2 菜单&路由（命名空间的设计，文件夹命名建议等）
#### 5.3 接口调用 —— request模块
#### 5.4 日志监控 —— aegis模块
#### 5.5 前后端分离 —— mock支持
#### 5.6 实用工具
##### （1）页面创建：pageCreate
##### （2）路由自动生成：routeCreate
#### 5.7 静态资源管理（本地图片、svg、css管理、打包后代码上传腾讯云cos）
#### 5.8 开发支持
（1）本地联调跨域解决 —— proxy代理方案（待复盘）
（2）命令行启动，模式区分设计
#### 5.9 规范代码
（1）.eslintrc 与 .editorconfig
（2）pre-commit 检查
## · 管理端-react（开发中）
## · 小程序-原生（开发中）
## · 小程序-taro（开发中）
## · 小程序-wepy（开发中）
## · 移动端-vue（开发中）
## · 移动端-react（开发中）
## · NodeJS-koa（开发中）
## · NodeJS-express（开发中）
## · 组件工具-原生js（开发中）
## · 组件工具-vue组件（开发中）
## · 组件工具-react组件（开发中）
