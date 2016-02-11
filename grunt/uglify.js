module.exports = {
  dist:{
    options: {
       mangle: false
    },
    src:[
      "dist/js/transpiled/dist.js"
    ],
    dest:"dist/js/app.transpiled.min.js"
  }
}
