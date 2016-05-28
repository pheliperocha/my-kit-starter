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
// Add autoprefixer
// Concatante with normalize and libs css files
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
        gulp.src(['./app/lib/normalize-css/normalize.css']),
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
// Get normalize.css and unglify
// Compile site sass files into css
// Add autoprefixer and uglify
// Concatante with libs css files
// Send to dist folder
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
        gulp.src(['./app/lib/normalize-css/normalize.css']).pipe($.plumber()).pipe($.uglifycss()),
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

gulp.task('view', function () {
    gulp.src('./app/view/**/*')
        .pipe($.plumber())
        .pipe(gulp.dest('dist/view/'))
        .pipe($.browserSync.stream());
});

gulp.task('view_deploy', function () {
    gulp.src(['./app/view/**/*'])
        .pipe($.plumber())
        .pipe($.htmlmin({collapseWhitespace: true, removeComments: true}))
        .pipe(gulp.dest('./dist/view/'));
});

gulp.task('index', function() {
    return gulp.src(['./app/index.php'])
        .pipe($.plumber())
        .pipe($.htmlmin({collapseWhitespace: true, removeComments: true}))
        .pipe(gulp.dest('./dist/'))
        .pipe($.browserSync.stream());
});

gulp.task('index_deploy', function() {
    return $.streamqueue(
        { objectMode: true },
        gulp.src(['./app/*', './app/.*', '!./app/index.php']),
        gulp.src(['./app/index.php']).pipe($.plumber()).pipe($.htmlmin({collapseWhitespace: true, removeComments: true}))
    )
        .pipe($.plumber())
        .pipe(gulp.dest('./dist/'))
        .pipe($.browserSync.stream());
});

// Optimize images
gulp.task('images', function () {
    return $.streamqueue(
        { objectMode: true },
        gulp.src(['./app/img/**/*.jpg', './app/img/**/*.png', './app/img/**/*.gif', './app/img/**/*.svg'])
    )
        .pipe($.plumber())
        .pipe(gulp.dest('dist/img'))
        .pipe($.size({title: 'images'}))
});

// Optimize images
gulp.task('images_deploy', function () {
    return $.streamqueue(
        { objectMode: true },
        gulp.src(['./app/img/**/*.jpg', './app/img/**/*.png', './app/img/**/*.gif', './app/img/**/*.svg'])
    )
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
    gulp.watch("./app/index.php", ['index']);
    gulp.watch("./app/view/**/*", ['view']);
});

gulp.task('prod', function (cb) {
    return $.runSequence('clean', ['scripts_deploy', 'styles_deploy', 'view_deploy', 'index_deploy', 'images_deploy', 'plato'], cb)
});

gulp.task('default', function (cb) {
    return $.runSequence(['scripts', 'styles', 'view', 'index', 'images', 'plato'], 'connect', 'watch', cb)
});
