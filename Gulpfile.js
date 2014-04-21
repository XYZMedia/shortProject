var gulp    = require('gulp'), 
    jshint  = require('gulp-jshint'),
    nodemon = require('gulp-nodemon'),
    notify  = require('gulp-notify');

var paths = {
  scripts: ["./modules/**/*.js", "./*.js"],
  server : {
  express: './server.js',
  specs  : [] 
  }
};

gulp.task('jshint', function() {
  gulp.src(paths.scripts)
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(notify({message: 'Linting has completed'}));
});

gulp.task('nodemon', function() {
  nodemon({script: paths.server.express });
});

gulp.task('build', ['jshint']);

gulp.task('default', ['nodemon', 'watch']);

gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['build']);
});