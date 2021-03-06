var gulp    = require('gulp'), 
    jshint  = require('gulp-jshint'),
    nodemon = require('gulp-nodemon'),
    notify  = require('gulp-notify');

var paths = {
  scripts: ["./app/modules/**/*.js", "./*.js"],
  server : {
  express: './backend/server.js',
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

gulp.task('default', ['nodemon', 'jshint', 'watch']);

gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['build']);
});