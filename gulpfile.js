'use strict';
// gulp plug-ins
const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const runSequence = require('run-sequence');
const responsiveGm = require('gulp-responsive-images');
const responsiveSharp = require('gulp-responsive');
const autoprefixer = require('gulp-autoprefixer');
const csso = require('gulp-csso');
const del = require('del');
var htmlmin = require('gulp-htmlmin');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify-es').default;
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const $ = gulpLoadPlugins();

gulp.task('browser-sync', function(){
  browserSync.init({
    server: "./"
  })
  browserSync.stream();
  
})

// use GM then move to folder responsive
gulp.task('imagesgm', function () {
  return gulp.src('img_src/*.jpg')
    .pipe(responsiveGm({
      '*.jpg': [{
        width: 700,
        suffix: 'lg_2x',
        quality: 60
      }, 
      { 
        width: 500,
        suffix: 'md_1x',
        quality: 70
      }, 
      {
        width: 300,
        // crop: 'center',
        suffix: 'sm_2x',
        quality: 70 
      }],
    }))
    .pipe(gulp.dest('./img/rest-list/'));
});


// use imagemin then move to folder images 
gulp.task('imagesmin', () => {
  return gulp.src('./img/rest-list/**/*/')
    .pipe(($.imagemin())
    .pipe(gulp.dest('./img/')));
});

// copies any images in fixed to images folder 
gulp.task('copy-fixed-images', function() {
  return gulp.src('./img_src/rest-list/**/*/')
    .pipe(gulp.dest('./img/'));
});

// ==========================================
// fix pages errors
// Gulp task to minify HTML files
// gulp.task('pages', function() {
//   return gulp.src(['./**/*.html'])
//     .pipe(htmlmin({
//       collapseWhitespace: true,
//       removeComments: true
//     }))
//     .pipe(gulp.dest('./dist/html'));
// });

// gulp.task('styles', function(){
//   return gulp.src('sass/**/*.scss')
//   .pipe(sass({outputStyle: 'compressed'})
//   .on('error', sass.logError))
//   .pipe(autoprefixer({browsers: ['last 2 versions']
// })) 
//   .pipe(gulp.dest('./css'))
//   .pipe(browserSync.stream());
// });

// Gulp task to minify CSS files
gulp.task('styles', function () {
  return gulp.src('./css/**/*.css')
    // Auto-prefix css styles for cross browser compatibility
    .pipe(autoprefixer()) 
    .pipe(csso())
    .pipe(concat('allcss.css'))
    .pipe(gulp.dest('./dist/css'))
    .pipe(browserSync.stream());

    gulp.watch("/css/*.css").on('change', browserSync.reload);
    gulp.watch("/*.html").on('change', browserSync.reload);
});


gulp.task('scripts', function() {
  return gulp.src('./js/**/*.js')
    .pipe(uglify())
    // .pipe(concat('all.js'))
    .pipe(gulp.dest('./dist/js'));
});

// combo build task for responsive (gm) and min images
gulp.task('default', function(callback) {
  runSequence('browser-sync','imagesgm', ['imagesmin', 'copy-fixed-images'], 'styles', 'scripts',
    callback);
});