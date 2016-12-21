const gulp = require('gulp');
const babel = require('gulp-babel');
const eslint = require('eslint/lib/cli');
const jscpd = require('gulp-jscpd');
const jsdoc = require('gulp-jsdoc3');

const spawn = require('child_process').spawn;

// config
const paths = {
  from: 'src/**/*.js',
  to: 'lib/'
};

gulp.task('lint', pipeline => {
  const exitCode = eslint.execute('--ext .js src');
  pipeline(exitCode);
});

gulp.task('jscpd', () => gulp
  .src(paths.from, { base: '.' })
  .pipe(jscpd())
);

gulp.task('jsdoc', () => {
  const jsDocConf = require('./jsdocConf.json');

  return gulp.src(paths.from, { base: '.', read: false })
    .pipe(jsdoc(jsDocConf));
});

gulp.task('test', pipeline => {
  const args = ['./node_modules/.bin/mocha'];
  const nyc = spawn('./node_modules/.bin/nyc', args, {
    stdio: 'inherit',
    env: Object.assign(process.env, {
      NODE_ENV: 'test',
      FORCE_COLOR: 'true'
    })
  });

  nyc.on('close', code => {
    pipeline(code);
  });
});

gulp.task('js', () => gulp
  .src(paths.from)
  .pipe(babel({
    presets: ['es2015']
  }))
  .pipe(gulp.dest(paths.to))
);

gulp.task('build', ['test', 'lint', 'js']);

gulp.task('default', ['js']);

gulp.task('watch', () => {
  gulp.watch(paths.from, ['js']);
});

