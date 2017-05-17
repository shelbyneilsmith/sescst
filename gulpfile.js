/**
 *
 * Gulpfile setup
 *
 * @since 1.0.0
 * @authors Ahmad Awais, @digisavvy, @desaiuditd, @jb510, @dmassiani and @Maxlopez
 * @package neat
 * @forks _s & some-like-it-neat
 */

// Project configuration
var project         = 'sesc-staff-tools', // Project name, used for build zip.
    url         = 'sescst.dev', // Local Development URL for BrowserSync. Change as-needed.
    build       = './buildtheme/', // Files that you want to package into a zip go here
    assetsDir = 'app/static/',
    buildInclude = [
        // include common file types
        '**/*.php',
        '**/*.html',
        '**/*.css',
        '**/*.js',
        '**/*.svg',
        '**/*.ttf',
        '**/*.otf',
        '**/*.eot',
        '**/*.woff',
        '**/*.woff2',

        // include specific files and folders
        'screenshot.png',
        'readme.txt',

        // exclude files and folders
        '!node_modules/**/*',
        '!assets/bower_components/**/*',
        '!assets/css/maps/*',
        '!assets/js/maps/*',
        '!assets/source/*',
    ],
    paths = {
        css: {
            src: [assetsDir + 'source/scss'],
            dist: assetsDir + 'css'
        },
        js: {
            src: [assetsDir + 'source/js'],
            dist: assetsDir + 'js'
        },
        img: {
            // src: [assetsDir + 'source/img'],
            dist: assetsDir + 'img'
        }
    };


// Load plugins
var     gulp         = require('gulp'),
    browserSync  = require('browser-sync'), // Asynchronous browser loading on .scss file changes
    reload       = browserSync.reload,
    autoprefixer = require('gulp-autoprefixer'), // Autoprefixing magic
    cssnano = require('gulp-cssnano'),
    uglify       = require('gulp-uglify'),
    rename       = require('gulp-rename'),
    concat       = require('gulp-concat'),
    notify       = require('gulp-notify'),
    sass         = require('gulp-sass'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    sourcemaps   = require('gulp-sourcemaps');


function handleError(err) {
    console.log(err.toString());
    this.emit('end');
}

/**
 * Styles
 *
 * Looking at src/sass and compiling the files into Expanded format, Autoprefixing and sending the files to the build folder
 *
 * Sass output styles: https://web-design-weekly.com/2014/06/15/different-sass-output-styles/
*/
var autoprefixerOptions = {
    browsers: ['last 2 versions', '> 5%', 'Firefox ESR']
};

gulp.task('styles', function () {
    return gulp.src(paths.css.src + '/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            errLogToConsole: true,

            //outputStyle: 'compressed',
            outputStyle: 'compact',
            // outputStyle: 'nested',
            // outputStyle: 'expanded',
            precision: 10,
        }))
        .on('error', handleError)
        .pipe(autoprefixer(autoprefixerOptions))
        .pipe(rename({ suffix: '.min' }))
        .pipe(cssnano())
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest(paths.css.dist))
        .pipe(notify({ message: 'Styles task complete', onLast: true }));
});

/**
 * Scripts
 *
 * Look at src/js and concatenate those files, send them to assets/js where we then minimize the concatenated file.
*/

function handleErrors() {
    var args = Array.prototype.slice.call(arguments);
    notify.onError({
        title: "Compile Error",
        message: "<%= error.message %>"
    }).apply(this, args);
    this.emit('end'); // Keep gulp from hanging on this task
}

function buildScript(file) {
    var props = {entries: [paths.js.src + '/' + file], debug: true};
    var bundler = browserify(props);
    var stream = bundler.bundle();
    return stream.on('error', handleErrors)
        .pipe(source('main.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest(paths.js.dist))
        .pipe(notify({ message: 'Scripts task complete' }));
}

gulp.task('scripts', function() {
    return buildScript('app.js');
});


 // ==== TASKS ==== //
 /**
  * Gulp Default Task
  *
  * Compiles styles, fires-up browser sync, watches sass, js and php files. Note browser sync task watches php files
  *
 */


 // Watch Task
gulp.task('default', ['styles', 'scripts'], function () {
    gulp.watch(paths.css.src + '/**/*.scss', ['styles']);
    gulp.watch(paths.js.src + '/**/*.js', ['scripts']);
});
