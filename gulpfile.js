// *** Plugins ***
var gulp        = require("gulp"),
	sass        = require("gulp-sass"),
	concat      = require("gulp-concat"),
	watch       = require("gulp-watch"),
	plumber     = require("gulp-plumber"),
	minify_css  = require("gulp-minify-css"),
	uglify      = require("gulp-uglify"),	
	sourcemaps  = require("gulp-sourcemaps"),
    notify      = require("gulp-notify"),
    prefix      = require("gulp-autoprefixer"),
    imagemin    = require("gulp-imagemin"),
    jshint      = require("gulp-jshint"),
    pngquant    = require("imagemin-pngquant"),
    mozjpeg     = require("imagemin-mozjpeg"),
    browsersync = require("browser-sync"),
    wiredep     = require("wiredep").stream;



// *** Destination Folder ***
var src = {
	sass: "src/sass/**/*.scss",
	  js: "src/js/**/*.js",
	 img: "src/img/*",
	html: "scr/**/*.html",
}

var dist = {
	     js: "dist/js",
	    css: "dist/css",
	    img: "dist/img",
	   html: "dist/**/*.html",
	 min_js: 'app.min.js',
	min_css: 'app.min.css'
}



// *** Error Handler ***
var onError = function(err){
	console.log(err);
	this.emit('end');
}

// *** SASS to CSS ***
gulp.task('sass', function(){
	return gulp.src(src.sass)
		.pipe(plumber({
			errorHandler: onError
		}))
		.pipe(sass())
		.pipe(prefix('last 2 versions'))
		.pipe(concat(dist.min_css))
		.pipe(minify_css())
		.pipe(gulp.dest(dist.css))
		.pipe(sourcemaps.init())
		.pipe(sourcemaps.write())		
		.pipe(gulp.dest(dist.css))
		.pipe(browsersync.reload({stream: true}))
		//.pipe(notify({message: 'Hello! We are done'}))
});

// *** Compile JS ***
gulp.task('js', function(){
	gulp.src(src.js)
		.pipe(plumber({
			errorHandler: onError
		}))
		.pipe(jshint())
		.pipe(jshint.reporter('default'))		
		.pipe(uglify())
		.pipe(concat(dist.min_js))
		.pipe(sourcemaps.init())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(dist.js))
		.pipe(browsersync.reload({stream: true}))
});

// *** Images ***
gulp.task('img', function(){
	return gulp.src(src.img)
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [mozjpeg()]
		}))
		.pipe(gulp.dest(dist.img));
});

// *** Fonts ***
gulp.task('fonts', function () {
  gulp.src(['fonts/**/*'])
    .pipe(gulp.dest('dist/fonts'));
});

// *** Bower Components ***
gulp.task('bower', function () {
  gulp.src(['bower_components/**/*'])
    .pipe(gulp.dest('dist/bower_components'));
});

// *** Inject Bower Components ***
gulp.task('inject', function () {
  gulp.src(['dist/index.html'])
    .pipe(wiredep({
		directory: "bower_components"
    }))
    .pipe(gulp.dest('./dist'));
});

// *** Watch ***
gulp.task('watch', function(){
	browsersync.init({
		server: './dist'
	});
	gulp.watch(src.js, ['js']);
	gulp.watch(src.sass, ['sass']);
	gulp.watch(src.img, ['img']);
	gulp.watch('bower.json', ['bower']);
	gulp.watch(dist.html).on('change', browsersync.reload);
});

// *** Default ***
gulp.task('default', ['watch', 'sass', 'js', 'img', 'fonts', 'bower', 'inject']);