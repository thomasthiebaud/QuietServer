'use strict';

const gulp = require('gulp');
const eslint = require('gulp-eslint');
const istanbul = require('gulp-istanbul');
const mocha = require('gulp-mocha');

gulp.task('lint', () =>
  gulp.src(['**/*.js', '!node_modules/**', '!test/fixtures/**', '!coverage/**'])
    .pipe(eslint({
      rulePaths: ['.'],
      quiet: false,
    }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
);

gulp.task('test', () => {
  gulp.src(['app/**/*.js'])
    .pipe(istanbul())
    .pipe(istanbul.hookRequire())
    .on('finish', () => {
      gulp.src(['test/**/*.js'])
        .pipe(mocha())
        .pipe(istanbul.writeReports())
        .once('error', () => process.exit(1))
        .once('end', () => process.exit());
    });
});

gulp.task('default', ['lint', 'test'], () => {
    // This will only run if the lint task is successful...
});
