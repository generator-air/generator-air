const fs = require('fs');
const path = require('path');

const mockData = {
  DB: {},
  readDir(path) {
    const stats = fs.statSync(path);
    if (stats.isDirectory()) {
      const files = fs.readdirSync(path);
      files.forEach((file) => {
        this.readDir(`${path}/${file}`);
      });
    } else {
      const data = fs.readFileSync(path);
      const startIndex = path.indexOf('mock/data');
      const mockPath = path.substring(startIndex + 10);
      // 把json文件的路径作为key
      const key = mockPath.replace('.json', '').replace(/\//g, '_');
      this.DB[key] = JSON.parse(data);
    }
  },
};

mockData.readDir(path.resolve(__dirname, 'data'));

module.exports = mockData.DB;
