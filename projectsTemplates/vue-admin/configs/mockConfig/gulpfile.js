const $gulp = require('gulp');
const $execa = require('execa');
const $gulpUtil = require('gulp-util');
const $gulpConfirm = require('gulp-confirm');
const $qcloudUpload = require('gulp-qcloud-cos-upload');
const $config = require('./config');
const $colors = $gulpUtil.colors;

// 杀掉正在执行的 server 进程，确保同一时间只有一个开发服务存在
$gulp.task('tool-kill-running', (done) => {
  let getPids = (rs, keyword) =>
    rs.stdout
      .split(/\n/)
      .filter((str) => str.indexOf(keyword) > 0)
      .map((str) => str.split(/\s+/)[1]);
  let getPromise = (name) =>
    $execa
      .shell('ps aux | grep ' + name)
      .then((rs) => getPids(rs, 'bin/' + name))
      .then((pids) => {
        if (!pids.length) {
          console.info($colors.green('[process check] no working ' + name));
          return Promise.resolve();
        }
        return Promise.all(
          pids.map((pid) => {
            console.info(
              $colors.yellow(
                '[process check] working ' + name + ' killed:' + pid
              )
            );
            return $execa.shell('kill -9 ' + pid, { stdio: 'inherit' });
          })
        );
      });
  if (process.platform.indexOf('win32') >= 0) {
    done();
  } else {
    Promise.all(
      [
        'spore-mock', // 关闭相同端口号的进程
      ].map((key) => getPromise(key))
    ).then(() => done());
  }
});

$gulp.task('upload', () =>
  $gulp
    .src(['**/*.{js,css,ttf,woff,svg,eot,png,jpg,jpeg,gif}'], {
      // 本地静态资源地址
      cwd: $config.dist,
      // 上传cdn的地址（附加在prefix后面） 注：如果不加，prefix后面，会默认读取本机的文件夹目录
      base: $config.dist,
    })
    .pipe(
      $gulpConfirm({
        question: $gulpUtil.colors.yellow('Start upload dist ? [y/n]'),
        input: '_key:y',
      })
    )
    .pipe($qcloudUpload($config.uploadConfig))
);
// =================
// common tasks
// =================
$gulp.task('serve', (done) => {
  $execa('vue-cli-service', ['serve'], {
    stdio: 'inherit',
  });
  done();
});
// json-server 启动
$gulp.task('json-server', (done) => {
  $execa('node', ['./mock/mock-server.js'], {
    stdio: 'inherit',
  });
  done();
});
// serve 开发环境
$gulp.task('dev', $gulp.series('tool-kill-running', 'json-server', 'serve'));
// serve mock环境
$gulp.task('debug', $gulp.series('tool-kill-running', 'serve'));
$gulp.task('build', (done) => {
  $execa('vue-cli-service', ['build'], {
    stdio: 'inherit',
  });
  done();
});
$gulp.task('default', $gulp.series('serve'));
