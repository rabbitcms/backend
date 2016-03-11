requirejs.config({
    
    baseUrl: "/",

    paths: {
        jquery: 'bower/jquery/dist/jquery.min.js',
        bootstrap: 'bower/bootstrap/dist/js/bootstrap.min',
        'jquery.validate': 'bower/jquery-validation/dist/jquery.validate',
        'additional-methods': 'bower/jquery-validation/dist/additional-methods'
    },
    shim: {
        'bootstrap': {
            export: 'jQuery',
            deps: ['css', 'jquery'],
            init: function (css, jquery) {
                css.load(require.toUrl('bootstrap') + '/../../css/bootstrap.css');
                return jquery;
            }
        }
    }
});

define('css', {
    load: function (url) {
        var link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = url;
        document.getElementsByTagName("head")[0].appendChild(link);
    }
});

requirejs(['additional-methods', 'css', 'module'], function ($, css, module) {

});