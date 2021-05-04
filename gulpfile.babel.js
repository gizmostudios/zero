import concat from 'gulp-concat';
import del from 'del';
import gulp from 'gulp';
import imagemin from 'gulp-imagemin';
import livereload from 'gulp-livereload';
import pug from 'gulp-pug';
import sass from 'gulp-dart-sass';
import sassLint from 'gulp-sass-lint';
import server from 'gulp-webserver';
import sourcemaps from 'gulp-sourcemaps';

const config = {
	serverPort: 8080,
	liveReloadPort: 8081
};

const templatesData = {
	liveReloadPort: config.liveReloadPort,
	title: 'UWV Content Platform',
	author: 'elbert4net',
};

const paths = {
	dist: 'dist/',
	templates: {
		watch: 	'src/templates/**/*.pug',
		src: 	'src/templates/*.pug',
		dist: 	'dist/',
	},
	images: {
		watch:	'src/assets/images/**/*.*',
		src:	'src/assets/images/**/*.*',
		dist:	'dist/assets/images/',
	},
	styles: {
		watch: 	'src/assets/styles/**/*.scss',
		src: 	'src/assets/styles/*.scss',
		dist:	'dist/assets/styles/'
	},
	scripts: {
		watch: 	'src/assets/scripts/**/*.js',
		src: 	'src/assets/scripts/*.js',
		dist:	'dist/assets/scripts/'
	}
};

gulp.task('templates', () => {
	return gulp.src(paths.templates.src)
		.pipe(pug({
			doctype: 'HTML',
			pretty: '\t',
			data: templatesData
		}))
		.pipe(gulp.dest(paths.templates.dist))
		.pipe(livereload());
});

gulp.task('images', function () {
    return gulp.src(paths.images.src)
        .pipe(imagemin({
            interlaced: true
        }))
        .pipe(gulp.dest(paths.images.dist))
		.pipe(livereload());
});

gulp.task('styles', () => {
	return gulp.src(paths.styles.src)
		.pipe(sourcemaps.init())
		.pipe(sassLint())
        .pipe(sassLint.format())
        .pipe(sassLint.failOnError())
		.pipe(sass({}))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(paths.styles.dist))
		.pipe(livereload());
});

gulp.task('scripts', function () {
    return gulp.src(paths.scripts.src)
        .pipe(sourcemaps.init())
        .pipe(concat('main.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.scripts.dist))
        .pipe(livereload());
});

gulp.task('server', () => {
	return gulp.src(paths.dist)
		.pipe(server({
			open: false,
			port: config.serverPort
		}));
});

gulp.task('watch', () => {
	livereload.listen({
		port: config.liveReloadPort
	});
	gulp.watch(paths.templates.watch,	gulp.series('templates'));
	gulp.watch(paths.images.watch, 		gulp.series('images'));
	gulp.watch(paths.styles.watch,		gulp.series('styles'));
	gulp.watch(paths.scripts.watch,		gulp.series('scripts'));
});

gulp.task('default', gulp.series('server', 'watch'));