var gulp = require('gulp'),
	uglifyjs = require('gulp-uglify'),
	uglifycss = require('gulp-uglifycss'),
	autoprefixer = require('gulp-autoprefixer'),
	imagemin = require('gulp-imagemin');

// Task to uglify js files
gulp.task('scripts', function() {
	gulp.src('./dev/src/*.js')
		.pipe(uglifyjs())
		.on("error", errorLog)
		.pipe(gulp.dest('./dist/js/'));
});

// Task the styles files of the project
// Add autoprefixer in css styles to fit in the 5% most useful browser
// And minify the files
gulp.task('styles', function () {
	gulp.src('./dev/css/*.css')
		.pipe(autoprefixer({
			browsers: ['> 5%'],
		}))
		.pipe(uglifycss())
		.on("error", errorLog)
		.pipe(gulp.dest('./dist/css/'));
});

// Task to minify the images files
// Need review
gulp.task('image', function() {
	gulp.src('./img/*')
		.pipe(imagemin())
		.pipe(gulp.dest('./img/'));
});

// Watch the changes to then apply the uglify to the respectives files
gulp.task('watch', function() {
	gulp.watch("./dev/src/*.js", ['uglifyJS']);	
	gulp.watch("./dev/css/*.css", ['uglifyCSS']);	
});

// Function to catch erros and prevent to stop the watch event
function errorLog(error) {
	console.error.bind(error);
	this.emit('end');
}

gulp.task('default', ['scripts', 'styles', 'watch']);