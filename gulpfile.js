var assetsDir = 'app/static/';
var paths = {
    css: {
        src: [assetsDir + 'source/scss'],
        dist: assetsDir + 'css'
    },
    js: {
        src: [assetsDir + 'source/js'],
        dist: assetsDir + 'js'
    },
    img: {
        src: [assetsDir + 'source/img'],
        dist: assetsDir + 'img'
    }
};

var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    del = require('del');


gulp.task('lint', function() {
    return gulp.src(paths.js.src + '/**/*.js')
        .pipe(jshint({"globals": ["jQuery", "angular"]}))
        .pipe(jshint.reporter('default'));
});

gulp.task('styles', function() {
    var sourcemaps = require('gulp-sourcemaps');

    return sass(paths.css.src + '/**/*.scss', { sourcemap: true, require: ['susy'], })
        .pipe(sourcemaps.init())
        .on('error', function (err) {
            console.error('Error!', err.message);
        })
        .pipe(minifycss({compatibility: 'ie8'}))
        .pipe(rename({suffix: '.min'}))
        .pipe(autoprefixer('last 2 version'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.css.dist))
        .pipe(notify({ message: 'Styles task complete' }));
});

gulp.task('styles-dist', function() {
    return sass(paths.css.src + '/**/*.scss', { style: 'compressed', require: ['susy'] })
        .pipe(minifycss())
        .pipe(rename({suffix: '.min'}))
        .pipe(autoprefixer('last 2 version'))
        .pipe(gulp.dest(paths.css.dist))
        .pipe(notify({ message: 'Styles task complete' }));
});

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
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(paths.js.dist))
        .pipe(notify({ message: 'Scripts task complete' }));
}

gulp.task('scripts', function() {
    return buildScript('app.js');
});

gulp.task('images', function() {
   var imagemin = require('gulp-imagemin');

    return gulp.src([paths.img.src + '/**/*'])
        .pipe(cache(imagemin({ pngquant: true, progressive: true, interlaced: true })))
        .pipe(gulp.dest(paths.img.dist))
        .pipe(notify({ message: 'Images task complete' }));
});

gulp.task('clean', function() {
    return del([paths.css.dist, paths.js.dist]);
});

gulp.task('watch', function() {

    // Watch .scss files
    gulp.watch(paths.css.src + '/**/*.scss', ['styles']);

    // Watch .js files
    gulp.watch(paths.js.src + '/**/*.js', ['scripts']);

    // Watch image files
    gulp.watch(paths.img.src + '/**/*', ['images']);
});

gulp.task('default', ['watch']);
gulp.task('deploy', ['clean', 'lint', 'styles-dist', 'scripts-dist']);
