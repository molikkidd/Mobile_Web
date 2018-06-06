// gulp plug-ins
const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const del = require('del');
const runSequence = require('run-sequence');
const responsiveGm = require('gulp-responsive-images');
const responsiveSharp = require('gulp-responsive');

const $ = gulpLoadPlugins();

// // folder structure =
// // images_src for source files
// // responsive for processing
// // images for final processed files




// second simplier option in using gulp
 
// gulp.task('default', function () {
//   gulp.src('img_src/*.jpg')
//     .pipe(imageResize({
//       width : 600,
//       // crop : true,
//       upscale : true
//     }))
//     .pipe(gulp.dest('img'));
// });

// use GM then move to folder responsive
gulp.task('imagesgm', function () {
  return gulp.src('img_src/*.jpg')
    .pipe(responsiveGm({
      '*.jpg': [{
        width: 1200,
        suffix: '_lg_2x',
        quality: 75
      }, { 
        width: 800,
        suffix: '_md_1x',
        quality: 60
      }, {
        width: 500,
        height:400,
        crop: 'center',
        suffix: '_sm_2x',
        quality: 75
      }],
    }))
    .pipe(gulp.dest('./img/responsive/'));
});


// use imagemin then move to folder images 
gulp.task('imagesmin', () => {
  return gulp.src('./img/responsive/**/*/')
    .pipe(($.imagemin())
    .pipe(gulp.dest('./img/')));
});

// copies any images in fixed to images folder 
gulp.task('copy-fixed-images', function() {
  return gulp.src('./img_src/responsive/**/*/')
    .pipe(gulp.dest('./img/'));
});

// cleans responsive folder
gulp.task('resposnsive-tidy', function () {
  return del([
    './img/responsive/**/*/'
    ]);
});

// combo build task for responsive (gm) and min images
gulp.task('default', function(callback) {
  runSequence('imagesgm', 
              ['imagesmin', 'copy-fixed-images','responsive-tidy'],
              
              callback);
});