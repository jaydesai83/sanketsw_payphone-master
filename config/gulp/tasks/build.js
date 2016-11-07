var gulp = require('gulp');
var runSequence = require('run-sequence');
var config = require('../config')();
var useref = require('gulp-useref');
var gulpif = require('gulp-if');
var rev = require('gulp-rev');
var revReplace = require('gulp-rev-replace');
var uglify = require('gulp-uglify');
var cssnano = require('gulp-cssnano');
var zip = require('gulp-zip');
var pkg = require('../../../package.json');
var gzip = require('gulp-gzip');

require('@ngstarter/systemjs-extension')(config);

gulp.task('build', function(done) {
  runSequence('test', 'build-systemjs', 'build-assets', 'build-copy', done);
});


/* Concat and minify/uglify all css, js, and copy fonts */
gulp.task('build-assets', function(done) {
  runSequence('clean-build', ['sass', 'fonts', 'primeng-theme'], function() {
    gulp.src(config.app + '**/*.html', {
        base: config.app
      })
      .pipe(gulp.dest(config.build.app));

    gulp.src(config.app + '**/*.css', {
        base: config.app
      })
      .pipe(cssnano())
      .pipe(gulp.dest(config.build.app));

    gulp.src(config.src + 'favicon.ico')
      .pipe(gulp.dest(config.build.path));

    gulp.src(config.assetsPath.images + '**/*.*', {
        base: config.assetsPath.images
      })
      .pipe(gulp.dest(config.build.assetPath + 'images'));

    gulp.src(config.index)
      .pipe(useref())
      .pipe(gulpif('assets/lib.js', uglify()))
      .pipe(gulpif('*.css', cssnano()))
      .pipe(gulpif('!*.html', rev()))
      .pipe(revReplace())
      .pipe(gulp.dest(config.build.path))
      .on('finish', done);
  });
});

/* Copy primng theme */
gulp.task('primeng-theme', function() {
  gulp.src([config.assets + 'layout/fonts/**/*.*'])
    .pipe(gulp.dest(config.build.fonts));
  gulp.src([config.assets + 'layout/images/**/*.*'])
    .pipe(gulp.dest(config.build.images));
  gulp.src(config.assets + 'layout/images/**/*.*', {
      base: config.assets
    })
    .pipe(gulp.dest(config.build.assetPath));
});

/* This task is not needed anymore because we are using conenct.compress */
gulp.task('gzip', function(done) {
  gulp.src(config.build.path + '**/*.{js,css,html,woff,woff2,png,ico}*')
    .pipe(gzip())
    .pipe(gulp.dest('serve/'))
    .on('finish', done);
});


/* Copy fonts in packages */
gulp.task('fonts', function() {
  gulp.src(config.assetsPath.fonts + '**/*.*', {
      base: config.assetsPath.fonts
    })
    .pipe(gulp.dest(config.build.fonts));

  gulp.src(['node_modules/font-awesome/fonts/*.*'])
    .pipe(gulp.dest(config.build.fonts));
});


function excludeFolder(folderName) {
  return ['!' + folderName, '!' + folderName + '/**'];
}


gulp.task('build-copy', function() {
  var srcArray = ['./**/*']
    .concat(excludeFolder('./config'))
    .concat(excludeFolder('./src'))
    .concat(excludeFolder('./node_modules'))
    .concat(excludeFolder('./typings'))
    .concat(excludeFolder('./dist'))
    .concat(excludeFolder('./report'));
  return gulp.src(srcArray)
    .pipe(gulp.dest('dist'));
});
