module.exports = {
    dev: {
        nonull: true,
        files: [
            // Include our bower JS dependencies

            // angular
            {src: "bower_components/angular/angular.js", dest: "src/vendor/angular/angular.js"},
            {src: "bower_components/angular-animate/angular-animate.js", dest: "src/vendor/angular/angular-animate/angular-animate.js"},
            {src: "bower_components/angular-cookies/angular-cookies.js", dest: "src/vendor/angular/angular-cookies/angular-cookies.js"},
            {src: "bower_components/angular-resource/angular-resource.js", dest: "src/vendor/angular/angular-resource/angular-resource.js"},
            {src: "bower_components/angular-sanitize/angular-sanitize.js", dest: "src/vendor/angular/angular-sanitize/angular-sanitize.js"},
            {src: "bower_components/angular-touch/angular-touch.js", dest: "src/vendor/angular/angular-touch/angular-touch.js"},

            // raven
            {src: "bower_components/raven-js/dist/raven.js", dest: "src/vendor/libs/raven.js"},
            {src: "bower_components/angular-raven/angular-raven.js", dest: "src/vendor/angular/angular-raven/angular-raven.js"},

            // dexie
            {src: "bower_components/dexie/dist/latest/Dexie.js", dest: "src/vendor/libs/dexie/Dexie.js"},
            {src: "bower_components/dexie/addons/Dexie.Observable/Dexie.Observable.js", dest: "src/vendor/libs/dexie/Dexie.Observable.js"},
            {src: "bower_components/ng-dexie/dist/ngdexie.js", dest: "src/vendor/angular/ng-dexie/ngdexie.js"},

            // gsap
            {src: "bower_components/greensock/src/uncompressed/TweenMax.js", dest: "src/vendor/libs/greensock/TweenMax.js"},
            {src: "bower_components/greensock/src/uncompressed/TimelineMax.js", dest: "src/vendor/libs/greensock/TimelineMax.js"},

            // flickity
            {src: "bower_components/flickity/dist/flickity.css", dest: "src/css/flickity.css"},
            {src: "bower_components/flickity/dist/flickity.pkgd.js", dest: "src/vendor/libs/flickity/flickity.pkgd.js"},

            // highcharts
            {src: "bower_components/highcharts/highcharts.js", dest: "src/vendor/libs/highcharts/highcharts.js"},

            // check-types
            {src: "bower_components/check-types/src/check-types.min.js", dest: "src/vendor/libs/check-types.min.js"},

            // operative
            {src: "bower_components/operative/dist/operative.js", dest: "src/vendor/libs/operative.js"},

            // bootstrap
            {src: "bower_components/bootstrap/dist/css/bootstrap.css", dest: "src/css/bootstrap.css"},
            {src: "bower_components/bootstrap/dist/js/bootstrap.js", dest: "src/vendor/jquery/bootstrap.js"},
            {src: "**", dest: "src/fonts", cwd: "bower_components/bootstrap/fonts", expand : true},

            // angular material
            {src: "bower_components/angular-material/angular-material.min.css", dest: "src/css/angular-material.min.css"},
            {src: "bower_components/hammerjs/hammer.js", dest: "src/vendor/angular/angular-material/hammer.js"},
            {src: "bower_components/angular-aria/angular-aria.js", dest: "src/vendor/angular/angular-aria/angular-aria.js"},
            {src: "bower_components/angular-material/angular-material.js", dest: "src/vendor/angular/angular-material/angular-material.js"},

            // fontawesome
            {src: "bower_components/font-awesome/css/font-awesome.min.css", dest: "src/css/font-awesome.min.css"},
            {src: "**", dest: "src/fonts", cwd: 'bower_components/font-awesome/fonts', expand : true},

            // libs
            {src: "bower_components/moment/min/moment.min.js", dest: "src/vendor/libs/moment.min.js"},
            {src: "bower_components/screenfull/dist/screenfull.min.js", dest: "src/vendor/libs/screenfull.min.js"},
            {src: "bower_components/svg-morpheus/compile/unminified/svg-morpheus.js", dest: "src/vendor/libs/svg-morpheus.js"},
            // lesshat
            {src: "bower_components/lesshat/build/lesshat-prefixed.less", dest: "src/css/less/lesshat.prefixed.less"},

            // slick
            {src: "bower_components/slick.js/slick/slick.js", dest: "src/vendor/jquery/slick/slick.js"},
            {src: "bower_components/slick.js/slick/slick.css", dest: "src/css/slick.css"},
            {src: "bower_components/slick.js/slick/slick-theme.css", dest: "src/css/slick-theme.css"},
            {src: "bower_components/angular-slick/dist/slick.js", dest: "src/vendor/angular/angular-slick/slick.js"},

            // hotkeys
            {src: "bower_components/angular-hotkeys/build/hotkeys.js", dest: "src/vendor/angular/hotkeys/hotkeys.js"},
            {src: "bower_components/angular-hotkeys/build/hotkeys.css", dest: "src/css/hotkeys.css"},

            // json formatter
            {src: "bower_components/json-formatter/dist/json-formatter.js", dest: "src/vendor/angular/json-formatter/json-formatter.js"},
            {src: "bower_components/json-formatter/dist/json-formatter.css", dest: "src/css/json-formatter.css"},

            // ng-tags-input
            {src: "bower_components/ng-tags-input/ng-tags-input.js", dest: "src/vendor/angular/ng-tags-input/ng-tags-input.js"},
            {src: "bower_components/ng-tags-input/ng-tags-input.min.css", dest: "src/css/ng-tags-input.min.css"},

            // datetimepicker
            {src: "bower_components/angular-ui-bootstrap-datetimepicker/datetimepicker.js", dest: "src/vendor/angular/angular-ui-bootstrap-datetimepicker/datetimepicker.js"},
            {src: "bower_components/angular-ui-bootstrap-datetimepicker/datetimepicker.css", dest: "src/css/datetimepicker.css"},

            // core
            {src: "bower_components/angular-ui-router/release/angular-ui-router.js", dest: "src/vendor/angular/angular-ui-router/angular-ui-router.js"},
            {src: "bower_components/angular-locker/dist/angular-locker.js", dest: "src/vendor/angular/angular-locker/angular-locker.js"},
            {src: "bower_components/angular-filter/dist/angular-filter.js", dest: "src/vendor/angular/angular-filter/angular-filter.js"},
            {src: "bower_components/angular-data/dist/angular-data.js", dest: "src/vendor/angular/angular-data/angular-data.js"},
            {src: "bower_components/lodash/dist/lodash.js", dest: "src/vendor/angular/lodash/lodash.js"},
            {src: "bower_components/restangular/dist/restangular.js", dest: "src/vendor/angular/restangular/restangular.js"},
            {src: "bower_components/highcharts-ng/src/highcharts-ng.js", dest: "src/vendor/angular/highcharts-ng/highcharts-ng.js"},
            {src: "bower_components/angular-bootstrap/ui-bootstrap-tpls.js", dest: "src/vendor/angular/angular-bootstrap/ui-bootstrap-tpls.js"},
            {src: "bower_components/angular-translate/angular-translate.js", dest: "src/vendor/angular/angular-translate/angular-translate.js"},
            {src: "bower_components/angular-ui-utils/ui-utils.js", dest: "src/vendor/angular/angular-ui-utils/ui-utils.js"},
            {src: "bower_components/ngstorage/ngStorage.js", dest: "src/vendor/angular/ngstorage/ngStorage.js"},
            {src: "bower_components/oclazyload/dist/ocLazyLoad.js", dest: "src/vendor/angular/oclazyload/ocLazyLoad.js"},

            // modules for lazy load
            {src: "bower_components/angular-ui-select/dist/select.min.js", dest: "src/vendor/modules/angular-ui-select/select.min.js"},
            {src: "bower_components/angular-ui-select/dist/select.min.css", dest: "src/vendor/modules/angular-ui-select/select.min.css"},

            {src: "bower_components/angular-xeditable/dist/xeditable.js", dest: "src/vendor/modules/angular-xeditable/xeditable.js"},
            {src: "bower_components/angular-xeditable/dist/xeditable.css", dest: "src/vendor/modules/angular-xeditable/xeditable.css"},

            {src: "bower_components/angular-ui-select/dist/select.min.js", dest: "src/vendor/modules/angular-ui-select/select.min.js"},
            {src: "bower_components/angular-ui-select/dist/select.min.css", dest: "src/vendor/modules/angular-ui-select/select.min.css"},

            {src: "bower_components/textAngular/dist/textAngular.min.js", dest: "src/vendor/modules/textAngular/textAngular.min.js"},
            {src: "bower_components/textAngular/dist/textAngular-sanitize.min.js", dest: "src/vendor/modules/textAngular/textAngular-sanitize.min.js"},

            {src: "bower_components/venturocket-angular-slider/build/angular-slider.min.js", dest: "src/vendor/modules/angular-slider/angular-slider.min.js"},

            {src: "bower_components/angular-bootstrap-nav-tree/dist/abn_tree_directive.js", dest: "src/vendor/modules/angular-bootstrap-nav-tree/abn_tree_directive.js"},
            {src: "bower_components/angular-bootstrap-nav-tree/dist/abn_tree.css", dest: "src/vendor/modules/angular-bootstrap-nav-tree/abn_tree.css"},

            {src: "bower_components/angular-file-upload/angular-file-upload.min.js", dest: "src/vendor/modules/angular-file-upload/angular-file-upload.min.js"},

            {src: "bower_components/ngImgCrop/compile/minified/ng-img-crop.js", dest: "src/vendor/modules/ngImgCrop/ng-img-crop.js"},
            {src: "bower_components/ngImgCrop/compile/minified/ng-img-crop.css", dest: "src/vendor/modules/ngImgCrop/ng-img-crop.css"},

            {src: "bower_components/angular-ui-calendar/src/calendar.js", dest: "src/vendor/modules/angular-ui-calendar/calendar.js"},

            {src: "bower_components/angular-ui-map/ui-map.js", dest: "src/vendor/modules/angular-ui-map/ui-map.js"},

            {src: "bower_components/angularjs-toaster/toaster.js", dest: "src/vendor/modules/angularjs-toaster/toaster.js"},
            {src: "bower_components/angularjs-toaster/toaster.css", dest: "src/vendor/modules/angularjs-toaster/toaster.css"},

            {src: "bower_components/ng-grid/build/ng-grid.min.js", dest: "src/vendor/modules/ng-grid/ng-grid.min.js"},
            {src: "bower_components/ng-grid/ng-grid.min.css", dest: "src/vendor/modules/ng-grid/ng-grid.min.css"},

        ]
    },
    dist: {
        files: [
            {expand: true, dest: 'dist/', src:'**', cwd:'src/'},
            {dest: 'dist/index.html', src:'src/index.min.html'}
        ]
    }
};
