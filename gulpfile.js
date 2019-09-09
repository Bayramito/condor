const gulp = require('gulp');
const sass = require('gulp-sass');
const minifyCSS = require('gulp-csso');
const minifyHTML = require('gulp-htmlmin');
const minifyJS = require('gulp-uglify');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const del = require('del');
const runSequence = require('run-sequence');
const browserSync = require('browser-sync').create();

/*==========================================================================
  Browser Sync
==========================================================================*/
gulp.task('browser-sync', () => {
    browserSync.init({
        server: {
            baseDir: 'public'
        }
    });
});

/*==========================================================================
  Compile HTML
==========================================================================*/
gulp.task('html', () => {
    return gulp.src('src/**/*.html')
        .pipe(minifyHTML({
            collapseWhitespace: true,
            removeComments: true
        }))
        .pipe(gulp.dest('public'))
        .pipe(browserSync.stream());
});

/*==========================================================================
  Compile CSS
==========================================================================*/
gulp.task('css', () => {
    return gulp.src('src/sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(minifyCSS())
        .pipe(autoprefixer())
        .pipe(concat('app.min.css'))
        .pipe(gulp.dest('public/css'))
        .pipe(browserSync.stream());
});

/*==========================================================================
  Compile JS
==========================================================================*/
gulp.task('js', () => {
    return gulp.src('src/js/**/*.js')
        .pipe(concat('app.min.js'))
        .pipe(minifyJS())
        .pipe(gulp.dest('public/js'))
        .pipe(browserSync.stream());
});



/*==========================================================================
  Delete Task
==========================================================================*/
gulp.task('delete', () => del(['public/css', 'public/js', 'public/*.html']));

/*==========================================================================
  Watcher
==========================================================================*/
gulp.task('watch', () => {
    gulp.watch('src/js/**/*.js', ['js']);
    gulp.watch('src/*.html', ['html']);
    gulp.watch('src/sass/**/*.scss', ['css']);
});

/*==========================================================================
  Run Sequence
==========================================================================*/
gulp.task('default', () => {
    runSequence(
        'delete',
        'html',
        'css',
        'js',
        'browser-sync',
        'watch'
    )
});