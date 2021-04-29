import gulp from 'gulp';
import pug from 'gulp-pug';
import server from 'gulp-webserver';
import livereload from 'gulp-livereload';
import sass from 'gulp-dart-sass';

const paths = {
	dist: 'dist',
	pug: {
		watch: 'src/templates/**/*.pug',
		src: 'src/templates/*.pug'
	},
	scss: 'src/**/*.scss'
};

gulp.task('pug', () => {
	return gulp.src(paths.pug.src)
		.pipe(pug({
			pretty: true,
			data: {
				title: 'Zero',
				author: 'Gizmo'
			}
		}))
		.pipe(gulp.dest(paths.dist))
		.pipe(livereload());
});

gulp.task('scss', () => {
	return gulp.src(paths.scss)
		.pipe(sass({}))
		.pipe(gulp.dest(paths.dist))
		.pipe(livereload());
})

gulp.task('server', () => {
	return gulp.src(paths.dist)
		.pipe(server({
			open: false,
			port: 8080
		}));
});

gulp.task('watch', () => {
	livereload.listen();
	gulp.watch(paths.pug.watch, gulp.series('pug'));
	gulp.watch(paths.scss, gulp.series('scss'));
});

gulp.task('default', gulp.series('server', 'watch'));