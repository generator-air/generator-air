const jsonServer = require('json-server');
const path = require('path');
const fs = require('fs');

const $db = require('./db');

const server = jsonServer.create();

const middlewares = jsonServer.defaults();

const router = jsonServer.router($db);

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);

// To handle POST, PUT and PATCH you need to use a body-parser
server.use(jsonServer.bodyParser);

// 拦截客户端请求，进行自定义处理
server.use((req, res, next) => {
  // 如果未指定模拟错误情况，默认模拟请求成功
  if (req.url.indexOf('fail') === -1) {
    req.url = `/success${req.url}`;
  }
  // 手动处理非 get 请求，读取 mock/data 中定义的 json 数据。确保返回自定义的 mock data
  if (req.method !== 'GET') {
    const filePath = path.resolve(__dirname, `data${req.url}.json`);
    const contentText = fs.readFileSync(filePath, 'utf-8');
    res.set('Content-Type', 'application/json');
    res.send(contentText);
  } else {
    // 手动映射，更改请求url（/demo/edit => /demo_edit）
    req.url = req.url.replace(/\//g, '_').replace('_', '/');
    next();
  }
});

server.use(router);

server.listen(3001, () => {
  console.log('JSON Server is running at 3001');
});
