'use strict';
var exec        = require('child_process').exec;
var browserify  = require('browserify');
var clean       = require('gulp-clean');
var connect     = require('gulp-connect');
var glob        = require('glob');
var gulp        = require('gulp');
var karma       = require('gulp-karma');
var mocha       = require('gulp-mocha');
var ngmin       = require('gulp-ngmin');
var protractor  = require('gulp-protractor').protractor;
var source      = require('vinyl-source-stream');
var streamify   = require('gulp-streamify');
var uglify      = require('gulp-uglify');
var reactify    = require('reactify');
var notify      = require("gulp-notify");

var liveReload = true;

gulp.task('clean', function() {
    return gulp.src(['./client/js/dist'], { read: false })
    .pipe(clean());
});


gulp.task('lint', function() {
    return gulp.src([
        'gulpfile.js',
        'client/js/**/*.js'
    ])
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('browserify', function() {
    return browserify('./client/js/app.js')
    .bundle()
    .on('error', function(err){
        console.log(err);  
    })
    .pipe(source('app.js'))
    .pipe(gulp.dest('./client/js/dist/'))
    .pipe(connect.reload());
});



gulp.task('server', function(cb) {
    // child process: exec max buffer is 200kb could increate but better we use spawn
    // still don't think this is the way for prod but good enough for dev
    var cp = require('child_process');
    var child = cp.spawn('node', ['server.js'], {cwd: ''});

    child.stdout.on('data', function (data) {
        console.log('stdout: ' + data);
    });

    child.stderr.on('data', function (data) {
        console.log('stderr: ' + data);
    });

    child.on('close', function (code) {
        console.log('child process exited with code ' + code);
    });
});

gulp.task('watch', function() {
    gulp.start('server');
    gulp.watch([
        'client/js/**/*.js',
    ], ['browserify'])
    .on('error', function(err){
        console.log(err);  
    });
});

gulp.task('fast', ['clean'], function() {
    gulp.start('browserify');
});

gulp.task('default', ['fast'], function() {
    gulp.start('watch');
});


