'use strict';

var gulp, gulpLoadPlugins;

gulp = require('gulp');
gulpLoadPlugins = require('gulp-load-plugins');

const $ = gulpLoadPlugins({
    pattern: '*'
});

gulp.task('connect', function() {
    $.connectPhp.server({
        base: './dist/'
    }, function (){
        $.browserSync({
            proxy: '127.0.0.1:8000'
        });
    });
});

// Task to clean old files
gulp.task('clean', function () {
    return gulp.src('dist/')
        .pipe($.clean());
});

// Task to uglify js files
gulp.task('scripts', function () {
    return $.streamqueue(
        { objectMode: true },
        gulp.src(['./app/src/**/*.js'])
    )
        .pipe($.plumber())
        .pipe($.concat('script.min.js'))
        .pipe(gulp.dest('./dist/src/'))
        .pipe($.browserSync.stream());
});

// Task to uglify js files
gulp.task('scripts_deploy', function () {
    return $.streamqueue(
        { objectMode: true },
        gulp.src(['./app/src/**/*.js']).pipe($.plumber()).pipe($.uglify())
    )
        .pipe($.plumber())
        .pipe($.concat('script.min.js'))
        .pipe(gulp.dest('./dist/src/'))
});

// Task the styles files of the project
// Compile site sass files into css
// Add autoprefixer to fit in the 1% most useful browser and uglify
// Concatante with libs css files
// Send to dist folder
// Run stream in browserSync
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

    return $.streamqueue(
        { objectMode: true },
        gulp.src(['./app/styles/styles.scss']).pipe($.plumber()).pipe($.sass()).pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
    )
        .pipe($.plumber({
        errorHandler: function (err) {
            console.log(err);
            this.emit('end');
        }
    }))
        .pipe($.concat('style.min.css'))
        .pipe(gulp.dest('./dist/styles/'))
        .pipe($.browserSync.stream());
});

// Task the styles files of the project
// Compile site sass files into css
// Add autoprefixer to fit in the 1% most useful browser and uglify
// Concatante with libs css files
// Send to dist folder
// Run stream in browserSync
gulp.task('styles_deploy', function () {
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

    return $.streamqueue(
        { objectMode: true },
        gulp.src(['./app/styles/styles.scss']).pipe($.plumber()).pipe($.sass()).pipe($.autoprefixer(AUTOPREFIXER_BROWSERS)).pipe($.uglifycss())
    )
        .pipe($.plumber({
        errorHandler: function (err) {
            console.log(err);
            this.emit('end');
        }
    }))
        .pipe($.concat('style.min.css'))
        .pipe(gulp.dest('./dist/styles/'))
});

// Minify html files
gulp.task('html', function () {
    gulp.src('./app/**/*.html')
        .pipe($.plumber())
        .pipe(gulp.dest('dist/view/'))
        .pipe($.browserSync.stream());
});

// Minify html files
gulp.task('html_deploy', function () {
    gulp.src(['./app/**/*.html'])
        .pipe($.plumber())
        .pipe($.htmlmin({collapseWhitespace: true, removeComments: true}))
        .pipe(gulp.dest('./dist/view/'));
});

gulp.task('php', function() {
    return gulp.src(['./app/**/*.php'])
        .pipe($.plumber())
        .pipe(gulp.dest('./dist/'))
        .pipe($.browserSync.stream());
});

gulp.task('php_deploy', function() {
    return $.streamqueue(
        { objectMode: true },
        gulp.src(['./app/**/*.php']),
        gulp.src(['./app/*', './app/.*'])
    )
        .pipe($.plumber())
        .pipe(gulp.dest('./dist/'))
        .pipe($.browserSync.stream());
});

// Optimize images
gulp.task('images', function () {
    return gulp.src('./app/img/**/*')
        .pipe($.plumber())
        .pipe(gulp.dest('dist/img'))
        .pipe($.size({title: 'images'}))
});

// Optimize images
gulp.task('images_deploy', function () {
    return gulp.src('./app/img/**/*')
        .pipe($.plumber())
        .pipe($.cache($.imagemin({
        progressive: true,
        interlaced: true
    })))
        .pipe(gulp.dest('dist/img'))
        .pipe($.size({title: 'images'}))
});

gulp.task('plato', function () {
    return gulp.src('./app/src/**/*.js')
        .pipe($.plumber())
        .pipe($.plato('./report/', {
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
    gulp.watch("./app/src/**/*.js", ['scripts']);
    gulp.watch("./app/styles/**/*.scss", ['styles']);
    gulp.watch("./app/styles/**/*.css", ['styles']);
    gulp.watch("./app/**/*.php", ['php']);
    gulp.watch("./app/**/*.html", ['html']);
});

gulp.task('prod', function (cb) {
    return $.runSequence('clean', ['scripts_deploy', 'styles_deploy', 'html_deploy', 'php_deploy', 'images_deploy', 'plato'], cb)
});

gulp.task('default', function (cb) {
    return $.runSequence(['scripts', 'styles', 'html', 'php', 'images', 'plato'], 'connect', 'watch', cb)
});
