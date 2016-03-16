'use strict';

var gulp, gulpLoadPlugins;

gulp = require('gulp');
gulpLoadPlugins = require('gulp-load-plugins');

const $ = gulpLoadPlugins();

// Function to catch erros and prevent to stop the watch event
function errorLog(error) {
     console.error.bind(error);
     this.emit('end');
}

// Task to uglify js files
gulp.task('scripts', function () {
     gulp.src('./dev/src/**/*.js')
          .pipe($.concat('script.min.js'))
          .pipe($.uglify())
          .on("error", errorLog)
          .pipe(gulp.dest('./dist/js/'));
});

// Task the styles files of the project
// Compiler the sass files and concat
// Add autoprefixer in css styles to fit in the 1% most useful browser
// And minify
gulp.task('styles', function () {
     const AUTOPREFIXER_BROWSERS = [
          'ie >= 10',
          'ie_mob >= 10',
          'ff >= 30',
          'chrome >= 34',
          'safari >= 7',
          'opera >= 23',
          'ios >= 7',
          'android >= 4.4',
          'bb >= 10'
     ];



     gulp.src([
          './dev/styles/**/*.scss',
          './dev/styles/**/*.css'
     ])
     .pipe($.sass())
     .pipe($.concat('style.min.css'))
     .on("error", errorLog)
     .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
     .pipe($.uglifycss())
     .pipe(gulp.dest('./dist/styles/'));
});

// Optimize images
gulp.task('images', () =>
     gulp.src('./dev/img/**/*')
          .pipe($.cache($.imagemin({
               progressive: true,
               interlaced: true
          })))
          .pipe(gulp.dest('dist/images'))
          .pipe($.size({title: 'images'}))
);

gulp.task('plato', function () {
     return gulp.src('./dev/js/**/*.js')
          .pipe($.plato('./report', {
          jshint: {
               options: {
                    strict: true
               }
          },
          complexity: {
               trycatch: true
          }
     }));
});

// Watch the changes of scss and js files
gulp.task('watch', function () {
     gulp.watch("./dev/src/**/*.js", ['scripts']);
     gulp.watch("./dev/styles/**/*.scss", ['styles']);
});

gulp.task('default', ['scripts', 'styles', 'images', 'watch']);
