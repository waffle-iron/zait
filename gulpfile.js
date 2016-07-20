'use strict';

const gulp = require('gulp');
const babel = require('gulp-babel');
const mocha = require('gulp-mocha');
const eslint = require('eslint/lib/cli');
const jscpd = require('gulp-jscpd');
const jsdoc = require('gulp-jsdoc3');
const shell = require('gulp-shell');

const spawn = require('child_process').spawn;

//config
const paths = {
  from: 'src/**/*.js',
  to: 'lib/'
};

gulp.task('lint', function (pipeline) {
  const exitCode = eslint.execute('--ext .js src');
  pipeline(exitCode);
});

gulp.task('jscpd', function () {
  return gulp.src(paths.from, { base: '.' })
    .pipe(jscpd());
});

gulp.task('jsdoc', function () {
  const jsDocConf = require('./jsdocConf.json');

  return gulp.src(paths.from, { base: '.', read: false })
    .pipe(jsdoc());
});

gulp.task('test', function (pipeline) {
  const isparta = spawn('./test/.isparta', {
    stdio: 'inherit'
  });

  isparta.on('close', function (code) {
    pipeline(code);
  });
});

gulp.task('prepare-casper-test', function () {
  return gulp.src('./test/casperjs/*.js')
    .pipe(babel())
    .pipe(gulp.dest('./build/test'));
});

gulp.task('casper-test', ['prepare-casper-test'], function () {
  return gulp.src('./build/test/*.js', { read: false })
    .pipe(shell(['./node_modules/mocha-casperjs/bin/mocha-casperjs ./build/test/*.js', 'rm -rf ./build/test']))
});

gulp.task('js', function () {
  return gulp.src(paths.from)
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest(paths.to));
});

gulp.task('build', ['test', 'lint', 'js', 'jsdoc']);

gulp.task('default', ['js']);

gulp.task('watch', function () {
  gulp.watch(paths.from, ['js']);
});

