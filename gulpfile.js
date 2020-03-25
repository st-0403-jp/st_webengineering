'use strict';
const gulp = require("gulp");
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const runSequence = require('run-sequence');
const del = require('del');
const sync = require('browser-sync');

const srcPath = 'src/';
const distPath = 'dist/';
const srcPathList = {
    scss: srcPath + 'scss/**/*.scss',
    js: srcPath + 'js/**/*.js',
    copy: [
        srcPath + 'contact/mail.php',
        srcPath + 'img/**/*',
        srcPath + 'fonts/**/*',
        srcPath + 'lib/**/*',
        srcPath + 'favicon/*'
    ]
};

gulp.task('del', () => {
    return del([distPath + '*']).then(() => {
        console.info('delete ok');
    });
});

gulp.task('scss', () => {
    return gulp.src([srcPathList.scss], {base: srcPath})
            .pipe(sass())
            .pipe(rename((path) => {
                let p = path;
                p.dirname = p.dirname.replace('scss', 'css');
            }))
            .pipe(gulp.dest(distPath));
});

gulp.task('scss:dist', () => {
    return gulp.src([srcPathList.scss], {base: srcPath})
            .pipe(sass({outputStyle: 'compressed'}))
            .pipe(rename((path) => {
                let p = path;
                p.dirname = p.dirname.replace('scss', 'css');
            }))
            .pipe(gulp.dest(distPath));
});

gulp.task('js', () => {
    return gulp.src([srcPathList.js], {base: srcPath})
            .pipe(gulp.dest(distPath));
});

gulp.task('js:dist', () => {
    return gulp.src([srcPathList.js], {base: srcPath})
            .pipe(uglify())
            .pipe(gulp.dest(distPath));
});

gulp.task('copy', () => {
    return gulp.src(srcPathList.copy, {base: srcPath})
            .pipe(rename((path) => {
                let checkDir = path.dirname;

                if (checkDir === 'favicon') {
                    checkDir = '';
                }

                path.dirname = checkDir;
            }))
            .pipe(gulp.dest(distPath));
});

gulp.task('watch', () => {
    gulp.watch([srcPathList.scss], ['scss']);
    gulp.watch([srcPathList.js], ['js']);
});

gulp.task('sync', () => {
    sync.init({
		server: {
			baseDir: distPath,
            index: 'index.html'
        },
        files: [
            `${distPath}**/*`
        ]
	});
});

gulp.task('sync:reload', () => {
    // sync.reload();
});

gulp.task('default', () => {
    runSequence(['scss', 'js', 'copy'], 'watch', 'sync');
});

gulp.task('dist', () => {
    runSequence(['scss:dist', 'js:dist', 'copy']);
});