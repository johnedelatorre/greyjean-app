module.exports = {
	min: {
    files: [{
      expand: true,
      cwd: "src/templates/",
      src: ["*.html", "**/*.html"],
      dest: "dist/templates/",
      ext: ".html",
      extDot: "first"
    }]
  }
}
