'use strict';
//sass/////////////////////////////
const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('autoprefixer');
const postcss = require('gulp-postcss')
//options///////////////////////////
const browserSync = require('browser-sync').create();
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');
const plumber = require('gulp-plumber');


//Remove foder "dist"//////////////////////////////////////////////
gulp.task('clean', function() {
	return del('dist/');
});

//Scss to css////////////////////////////////////////
gulp.task('sass', function() {
	return gulp.src('app/scss/main.scss')
	.pipe(plumber())
  .pipe(sourcemaps.init())
  .pipe(postcss([ autoprefixer({browsers: ['last 2 versions']}) ]))
	.pipe(sass())
	.on('error', sass.logError)
	.pipe(sourcemaps.write('/'))
	.pipe(gulp.dest('dist/css/'))
	.pipe(browserSync.stream());
	});

//watcher/////////////////////////////////
gulp.task('watch', function() {
	gulp.watch('app/scss/**/*.scss', gulp.series('sass'));
	gulp.watch('app/**/*.html', gulp.series('templates'));
	gulp.watch(['app/icons/*.*', 'app/img/*.*'], gulp.series('images'));
});

//transfer all html files to "dist"/////////////////////////
gulp.task('templates', function() {
	return gulp.src('app/**/*.html')
	.pipe(gulp.dest('dist'));
});

//transfer all images to "dist"////////////////////////////
gulp.task('images', function() {
	return gulp.src(['app/icons/**', 'app/img/**'], {base: 'app/'})
	.pipe(gulp.dest('dist'))
})

//transfer fonts, normalize and onather static files or folders to "dist"////////////
gulp.task('assets', function() {
	return gulp.src(['app/fonts/**', 'app/css/normalize.css'], {base: 'app/'})
	.pipe(gulp.dest('dist'))
});

//liveserver///////////////////////////////////////////////
gulp.task('server', function() {
	browserSync.init({
	notify: false,
	port: 5000,
	server: {
		baseDir: 'dist/'
			}
		});
		browserSync.watch('dist/**/*.*', browserSync.reload);
});



//build derictory "dist" /////////////////////////////
gulp.task('default', gulp.series('clean',

gulp.parallel('sass', 'templates', 'assets', 'images'),

gulp.parallel('watch', 'server')
));

// {outputStyle: 'compressed'}