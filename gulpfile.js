const gulp = require("gulp");
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const runSequence = require('run-sequence');
const del = require('del');
const sync = require('browser-sync');

const srcPath = 'src/';
const distPath = 'dist/';
const srcPathList = {
    html: srcPath + '**/*.{html,php}',
    scss: srcPath + 'scss/**/*.scss',
    js: srcPath + 'js/**/*.js',
    copy: [
        srcPath + 'img/**/*',
        srcPath + 'fonts/**/*',
        srcPath + 'lib/**/*'
    ]
};

gulp.task('del', () => {
    return del([distPath + '*']).then(() => {
        console.info('delete ok');
    });
});

gulp.task('html', () => {
    return gulp.src([srcPathList.html], {base: srcPath})
            .pipe(gulp.dest(distPath));
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

gulp.task('js', () => {
    return gulp.src([srcPathList.js], {base: srcPath})
            .pipe(gulp.dest(distPath));
});

gulp.task('copy', () => {
    return gulp.src(srcPathList.copy, {base: srcPath})
            .pipe(gulp.dest(distPath));
});

gulp.task('watch', () => {
    gulp.watch([srcPathList.html], ['html', 'sync:reload']);
    gulp.watch([srcPathList.scss], ['scss', 'sync:reload']);
    gulp.watch([srcPathList.js], ['js', 'sync:reload']);
});

gulp.task('sync', () => {
    sync.init({
		server: {
			baseDir: distPath,
			index: 'index.html'
		}
	});
});

gulp.task('sync:reload', () => {
    sync.reload();
});

gulp.task('default', () => {
    runSequence('del', ['html', 'scss', 'js', 'copy'], 'watch', 'sync');
});

gulp.task('build', () => {
    runSequence('del', ['html', 'scss', 'js', 'copy']);
});