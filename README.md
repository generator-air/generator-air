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
根据提示，按需选择。
// 配每一步的截图及说明（特别是模板是否覆盖那里）
## 3.启动测试
```shell
npm run dev
```
// 配启动成功的终端截图
启动成功后，浏览器访问 localhost:8090
// 配浏览器成功打开，且控制台无报错的截图

# 三、各款脚手架介绍
## · 管理端-vue（已支持）
### 1.技术栈：vue + element-ui
### 2.启动效果：
// 配启动效果截图（在没有页面模板的情况下，优先把这里弄好看一些）
### 3.目录结构：
// 配目录结构截图
### 4.功能模块（// 功能、设计思想介绍 + 使用方式详述）
#### 4.1 用户权限
##### （1）权限管理
##### （2）用户信息管理
#### 4.2 接口调用 —— request模块
#### 4.3 日志监控 —— aegis模块
#### 4.4 实用工具
##### （1）页面创建：pageCreate
##### （2）路由自动生成：routeCreate
#### 4.5 静态资源管理 —— 上传腾讯云cos
#### 4.6 开发支持
（1）本地联调跨域解决 —— proxy代理方案（待复盘）
（2）命令行启动，模式区分设计
#### 4.7 规范代码
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
