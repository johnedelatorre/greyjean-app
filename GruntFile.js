module.exports = function(grunt) {
	var gtx = require('gruntfile-gtx').wrap(grunt);

  gtx.loadAuto();

  var gruntConfig = require('./grunt');
  gruntConfig.package = require('./package.json');

  gtx.config(gruntConfig);

  // We need our bower components in order to develop
  gtx.alias('build:dev',  ['recess:app', 'copy:dev']);
  gtx.alias('build:serve',  ['recess:app', 'copy:dev', "browserSync:dev", "watch" ]);
  gtx.alias('build:dist', ['clean:dist', 'sass:dist', 'copy:dist', 'clean:dists', 'recess:min', 'concat:dist', 'uglify:dist']);
  gtx.alias('release', ['bower-install-simple', 'build:dev', 'bump-commit']);
  gtx.alias('release-patch', ['bump-only:patch', 'release']);
  gtx.alias('release-minor', ['bump-only:minor', 'release']);
  gtx.alias('release-major', ['bump-only:major', 'release']);
  gtx.alias('prerelease', ['bump-only:prerelease', 'release']);
	// var childExec = require("child_process").exec,
 //    commandToBeExecuted = "6to5 src/js --out-dir src/transpiled/js -w -s";
	// childExec(commandToBeExecuted, function(error, stdout, stderr) {
	// 	grunt.log.writeln('6to5in es6 to es5 ..');
	// 	grunt.log.write('watching for changes to js and 6to5in ...').ok();
	// });
	gtx.finalise();
}
