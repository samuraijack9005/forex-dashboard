var gulp = require('gulp');
var cssScss = require('gulp-css-scss');
var rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');
var minifycss = require('gulp-minify-css');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var imagemin = require('gulp-imagemin');
var uglify = require('gulp-uglify-es').default;
var sourcemaps = require('gulp-sourcemaps');
var cache = require('gulp-cache');
var flatten = require('gulp-flatten');
var clean = require('gulp-clean');
var addsrc = require('gulp-add-src');
var browserSync = require('browser-sync').create();

var paths = {
	css: ['assets-raw/scss/**/*.css'],
	sass: ['assets-raw/scss/**/*.scss'],
	libscss: [
		'assets-raw/css/ripples.min.css',
		'node_modules/angular-fx/dist/angular-fx.min.css',
		'node_modules/animate.css/animate.min.css'		
	],
	libcsstomin : [
		'node_modules/bootstrap/dist/css/bootstrap.css',
		'node_modules/bootstrap-vertical-tabs/bootstrap.vertical-tabs.css',
		'node_modules/font-awesome/css/font-awesome.css',
		'node_modules/angular-toggle-switch/angular-toggle-switch-bootstrap.css',
		'node_modules/angular-toggle-switch/angular-toggle-switch.css',
		'assets-raw/css/bootstrap-material-design.css',
		'assets-raw/css/hover.css',
		'assets-raw/css/introjs.css',
		'assets-raw/css/codemirror/tern-extension.css',
		'node_modules/jsoneditor/dist/jsoneditor.css'
	],
	libsjs: [
		'node_modules/angular-fx/dist/angular-fx.min.js'
	],
	libsjstomin : [
		'node_modules/bootstrap/dist/js/bootstrap.js',
		'node_modules/angular-toggle-switch/angular-toggle-switch.js',
		'node_modules/countup.js-angular1/angular-countUp.js',
		'assets-raw/js/lib/ripples.js',
		'assets-raw/js/lib/material.js',
		'assets-raw/js/lib/arrive.js',
		'assets-raw/js/lib/angular-count-to.js',
		'assets-raw/js/lib/webtutor/intro.js',
		'assets-raw/js/lib/webtutor/angular-intro.js',
		'assets-raw/js/lib/codemirror/tern-extension.js',
		'assets-raw/js/lib/codemirror/ecmascript.json.js',
		'assets-raw/js/lib/codemirror/templates-hint.js',
		'assets-raw/js/lib/codemirror/ui-codemirror.js',
		'node_modules/jsoneditor/dist/jsoneditor.js',
		'assets-raw/js/lib/ng-jsoneditor.js'
	],
	customjstomin: [
		'assets-raw/js/*.js'
	],
	assets: {
		images: [
			'assets-raw/images/*.{gif,jpg,jpeg,png,svg,ico,pdf}',
			'assets-raw/images/**/*.{gif,jpg,jpeg,png,svg,ico,pdf}'
		],
		fonts: [
//			'assets-raw/fonts/**/*.{eot,svg,ttf,woff,woff2}'
//				'node_modules/font-awesome/fonts/**/*.{eot,svg,ttf,woff,woff2}',
//				'node_modules/bootstrap-sass/assets/fonts/bootstrap/**/*.{eot,svg,ttf,woff,woff2}'
		]
	},
	html: [
		'public/*.html',
		'public/views/*.html'
	],
	build: 'public/dist'
}

// Independent Task
gulp.task('browserSync', function () {
	browserSync.init({
		proxy: "forex.local",
		injectChanges: true,
		watchOptions: {
			debounceDelay: 1000 // This introduces a small delay when watching for file change events to avoid triggering too many reloads
		}
	});
});
 
gulp.task('css-scss', () => {
  return gulp.src("assets-raw/css/yappesstyle/**/*.css")
    .pipe(cssScss())
    .pipe(gulp.dest("assets-raw/scss"));
});

gulp.task('css', function () {
	gulp.src(paths.sass)
			.pipe(sourcemaps.init())
			.pipe(sass().on('error', sass.logError))
			.pipe(autoprefixer({
				browsers: [
					'> 1%',
					'last 2 versions',
					'firefox >= 4',
					'safari 7',
					'safari 8',
					'IE 8',
					'IE 9',
					'IE 10',
					'IE 11'
				],
				cascade: false
			}))
			.pipe(gulp.dest(paths.build + '/css'))
			.pipe(rename({
				suffix: '.min'
			}))
			.pipe(cleanCSS({
				level: {
					1:{all: false}
				}
			}))	
			.pipe(sourcemaps.write('maps'))
		.pipe(gulp.dest(paths.build + '/css'))
}); 

gulp.task('libCssMinify', function () {
	gulp.src(paths.libcsstomin)
		.pipe(cache.clear())
		.pipe(rename({
				suffix: '.min'
		}))
		.pipe(minifycss({
				keepSpecialComments: 0
		}))
		.pipe(addsrc.append(paths.libscss))	
		.pipe(concat("libcss.min.css"))
		.pipe(gulp.dest(paths.build + '/css'))
}); 

gulp.task('minScripts', function() {
   return gulp.src(paths.customjstomin)
   		.pipe(sourcemaps.init())
   		.pipe(cache.clear())
   		.pipe(sourcemaps.init())
       .pipe(concat('main.js'))
       .pipe(gulp.dest(paths.build + '/js'))
       .pipe(rename({
				suffix: '.min'
			}))
       .pipe(uglify().on('error', function(e){
           console.log(e);
        }))
       .pipe(sourcemaps.write('maps'))
       .pipe(gulp.dest(paths.build + '/js'));
});

gulp.task('libminScripts', function() {
   return gulp.src(paths.libsjstomin)
   		.pipe(cache.clear())
       .pipe(uglify().on('error', function(e){
           console.log(e);
        }))
       .pipe(addsrc.append(paths.libsjs))	
       .pipe(concat('libs.min.js'))
       .pipe(gulp.dest(paths.build + '/js'));
});



gulp.task('imgs', function () {
	gulp
		.src(paths.assets.images)
		.pipe(cache(imagemin({
			optimizationLevel: 3,
			progressive: true,
			interlaced: true,
			svgoPlugins: [{
				removeViewBox: false
			}]
		})))
		.pipe(gulp.dest(paths.build + "/images"));
});

gulp.task('clean', function () {
	return gulp.src(paths.build, {
			read: false
		})
		.pipe(clean());
});

gulp.task('default', ['css','libCssMinify','minScripts','libminScripts','imgs'],function(){

	/*browserSync.init({
		proxy: "yappes.local",
		injectChanges: true,
		watchOptions: {
			reloadDelay: 1000
		}
	});*/
		gulp.watch(paths.sass, ['css']);
		gulp.watch(paths.customjstomin, ['minScripts']);
		gulp.watch(paths.assets.images, ['imgs']);
		//gulp.watch(paths.html).on('change', browserSync.reload);
});

gulp.task('build', ['css','libCssMinify','minScripts','libminScripts','imgs']);