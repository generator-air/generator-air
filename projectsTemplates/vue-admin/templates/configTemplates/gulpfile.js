module.exports = ({
  mockServerName,
  mockServerTask,
}) => `const $gulp = require('gulp');
const $execa = require('execa');
const $gulpUtil = require('gulp-util');
const $gulpConfirm = require('gulp-confirm');
const $qcloudUpload = require('gulp-qcloud-cos-upload');
const $config = require('./config');


$gulp.task('upload', () => $gulp.src([
  '**/*.{js,css,ttf,woff,svg,eot,png,jpg,jpeg,gif}'
], {
  // 本地静态资源地址
  cwd: $config.dist,
  // 上传cdn的地址（附加在prefix后面） 注：如果不加，prefix后面，会默认读取本机的文件夹目录
  base: $config.dist
}).pipe(
  $gulpConfirm({
    question: $gulpUtil.colors.yellow('Start upload dist ? [y/n]'),
    input: '_key:y'
  })
).pipe(
  $qcloudUpload($config.uploadConfig)
));

$gulp.task('serve', done => {
  $execa('vue-cli-service', [
    'serve'
  ], {
    stdio: 'inherit'
  });
  done();
});

${mockServerTask}

// serve 开发环境
$gulp.task('dev', $gulp.series(${mockServerName}
  'serve'
));

// serve mock环境
$gulp.task('debug', $gulp.series(
  'serve'
));

$gulp.task('build', done => {
  $execa('vue-cli-service', [
    'build'
  ], {
    stdio: 'inherit'
  });
  done();
});

$gulp.task('default', $gulp.series('serve'));
`;
