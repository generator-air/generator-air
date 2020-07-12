const $fs = require('fs');

const mockData = {
  DB: {},
  readDir(path) {
    const stats = $fs.statSync(path);
    if (stats.isDirectory()) {
      const files = $fs.readdirSync(path);
      files.forEach((file) => {
        this.readDir(`${path}/${file}`);
      });
    } else {
      const data = $fs.readFileSync(path);
      // 把json文件的路径作为key
      const key = path
        .replace('.json', '')
        .replace('mock/data/', '')
        .replace(/\//g, '_');
      this.DB[key] = JSON.parse(data);
    }
  },
};

mockData.readDir('mock/data');

module.exports = mockData.DB;
