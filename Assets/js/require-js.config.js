require.config({
    "baseUrl": "/modules/",
    "shim": {
        "rabbitcms.backend.login": {
            "deps": ["rabbitcms.backend"]
        },
        "rabbitcms.backend.orders": {
            "deps": ["rabbitcms.backend"]
        },
        "rabbitcms.backend.users": {
            "deps": ["rabbitcms.backend"]
        }
    },
    "paths": {
        "rabbitcms.backend": "backend/js/rabbitcms.backend",
        "rabbitcms.backend.login": "backend/js/rabbitcms.backend.login",

        "rabbitcms.backend.users": "users/backend/js/rabbitcms.backend.users",
        "rabbitcms.backend.users.autocomplete": "users/backend/js/rabbitcms.backend.users.autocomplete",
        "dtkt.backend.users.agencies": "users/backend/js/dtkt.backend.users.agencies",
        "dtkt.backend.users.managers": "users/backend/js/dtkt.backend.users.managers",
        "dtkt.backend.users.firms": "users/backend/js/dtkt.backend.users.firms",

        "rabbitcms.backend.orders": "subscribe/backend/js/rabbitcms.backend.orders",
        "rabbitcms.backend.details": "subscribe/backend/js/rabbitcms.backend.details",
        "rabbitcms.backend.templates": "subscribe/backend/js/rabbitcms.backend.templates",
        "rabbitcms.backend.packages": "subscribe/backend/js/rabbitcms.backend.packages",
        "rabbitcms.backend.webinars": "webinars/backend/js/rabbitcms.backend.webinars",
        "rabbitcms.backend.news": "news/backend/js/rabbitcms.backend.news",

        "rabbitcms.backend.tags": "dtkt/backend/js/rabbitcms.backend.tags",
        "rabbitcms.backend.origins": "dtkt/backend/js/rabbitcms.backend.origins",
        "rabbitcms.backend.authors": "dtkt/backend/js/rabbitcms.backend.authors",
        "rabbitcms.backend.footer": "dtkt/backend/js/rabbitcms.backend.footer",

        "dtkt.backend.localization": "dtkt/backend/js/dtkt.backend.localization",
        "dtkt.backend.comments": "dtkt/backend/js/dtkt.backend.comments",

        "rabbitcms.backend.consulting": "consulting/backend/js/rabbitcms.backend.consulting",
        "rabbitcms.backend.questions": "consulting/backend/js/rabbitcms.backend.questions",
        "rabbitcms.backend.subscribers": "consulting/backend/js/rabbitcms.backend.subscribers",

        "rabbitcms.users" : "backend/js/rabbitcms.users",
        "rabbitcms.users.groups" : "backend/js/rabbitcms.users.groups",

        "rabbitcms.backend.blanks": "blanks/backend/js/rabbitcms.backend.blanks",
        "rabbitcms.backend.dates": "blanks/backend/js/rabbitcms.backend.dates",
        "rabbitcms.backend.rubrics": "blanks/backend/js/rabbitcms.backend.rubrics",

        "dtkt.subscribe.sampling.backend": "subscribe/backend/js/dtkt.subscribe.sampling.backend",
        "dtkt.subscribe.abilities": "subscribe/backend/js/dtkt.subscribe.abilities",
        "dtkt.subscribe.packages": "subscribe/backend/js/dtkt.subscribe.packages",
        "dtkt.subscribe.item": "subscribe/backend/js/dtkt.subscribe.item",
        "dtkt.luna": "backend/js/dtkt.luna",

        "dtkt.backend.documents": "documents/backend/js/dtkt.backend.documents",
        "dtkt.backend.documents.arrivals": "documents/backend/js/dtkt.backend.documents.arrivals",
        "dtkt.backend.documents.statistics": "documents/backend/js/dtkt.backend.documents.statistics"
    },
    "urlArgs": "0000000013"
});

define('jquery', [], function() { return jQuery; });
define('bootbox', [], function() { return bootbox; });
define('Highcharts', [], function() { return Highcharts; });
require(["jquery", "rabbitcms.backend"], function ($, RabbitCMS) {
    window.RabbitCMS = new RabbitCMS();

    $('body').removeClass('loading');
});