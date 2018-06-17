// gulp plug-ins
const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const runSequence = require('run-sequence');
const responsiveGm = require('gulp-responsive-images');
const responsiveSharp = require('gulp-responsive');

const $ = gulpLoadPlugins();

// // folder structure =
// // images_src for source files
// // responsive for processing
// // images for final processed files

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


// combo build task for responsive (gm) and min images
gulp.task('default', function(callback) {
  runSequence('imagesgm', ['imagesmin', 'copy-fixed-images'], callback);
});