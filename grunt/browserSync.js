var url = require("url");
var proxy = require("proxy-middleware");
var proxyOptions = url.parse("http://54.148.81.103:8080");
proxyOptions.route = "/flik_api/api/";
module.exports = {
	dev: {
    bsFiles: {
        src : ['src/css/*.css', 'src/transpiled/js/**/**/*.js', 'src/templates/**/**/*.html']
    },
    options: {
    	server: {
      	baseDir: "src",
        middleware: [proxy(proxyOptions)]
      },
      port: 3001,
      open: false,
      watchTask: true // < VERY important
    }
	}
}
