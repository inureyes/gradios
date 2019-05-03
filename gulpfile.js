var gulp = require('gulp');
var webserver = require('gulp-webserver');

var Paths = {
  HERE: './webserver/',
  PUBLIC : '**/*.js'
};

gulp.task('server', function() {
  gulp.src(Paths.HERE).pipe(webserver({
    open:'http://localhost:3000',
    livereload:true,
    directoryListing: false,
    port:3000
  }));
});


gulp.task('watch', function() {
	gulp.watch(Paths.HERE + Paths.PUBLIC)
});


gulp.task('default',gulp.parallel([
  'watch',
  'server',
], function () {
  console.log('Server is On! Wait for Open App! ')
}));