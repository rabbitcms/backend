require.config({
    "baseUrl": "/modules/",
    "shim": {
        "rabbitcms.backend.login": {
            "deps": ["rabbitcms.backend"]
        },
        "dtkt.subscribe.orders": {
            "deps": ["rabbitcms.backend"]
        },
        "dtkt.users": {
            "deps": ["rabbitcms.backend"]
        }
    },
    "paths": {
        "rabbitcms.backend": "backend/js/rabbitcms.backend",
        "rabbitcms.backend.login": "backend/js/rabbitcms.backend.login",
        "rabbitcms.backend.users" : "backend/js/rabbitcms.backend.users",
        "rabbitcms.backend.users.groups" : "backend/js/rabbitcms.backend.users.groups",

        "dtkt.blanks": "blanks/backend/js/dtkt.blanks",
        "dtkt.blanks.dates": "blanks/backend/js/dtkt.blanks.dates",
        "dtkt.blanks.rubrics": "blanks/backend/js/dtkt.blanks.rubrics",

        "dtkt.callcenter.users": "callcenter/backend/js/dtkt.callcenter.users",
        "dtkt.callcenter.orders": "callcenter/backend/js/dtkt.callcenter.orders",
        "dtkt.callcenter.sampling": "callcenter/backend/js/dtkt.callcenter.sampling",

        "dtkt.consulting": "consulting/backend/js/dtkt.consulting",
        "dtkt.consulting.questions": "consulting/backend/js/dtkt.consulting.questions",
        "dtkt.consulting.subscribers": "consulting/backend/js/dtkt.consulting.subscribers",

        "dtkt.documents": "documents/backend/js/dtkt.documents",
        "dtkt.documents.arrivals": "documents/backend/js/dtkt.documents.arrivals",
        "dtkt.documents.statistics": "documents/backend/js/dtkt.documents.statistics",

        "dtkt.luna": "dtkt/backend/js/dtkt.luna",
        "dtkt.tags": "dtkt/backend/js/dtkt.tags",
        "dtkt.origins": "dtkt/backend/js/dtkt.origins",
        "dtkt.authors": "dtkt/backend/js/dtkt.authors",
        "dtkt.footer": "dtkt/backend/js/dtkt.footer",
        "dtkt.localization": "dtkt/backend/js/dtkt.localization",
        "dtkt.comments": "dtkt/backend/js/dtkt.comments",

        "dtkt.news": "news/backend/js/dtkt.news",

        "dtkt.subscribe.item": "subscribe/backend/js/dtkt.subscribe.item",
        "dtkt.subscribe.abilities": "subscribe/backend/js/dtkt.subscribe.abilities",
        "dtkt.subscribe.package": "subscribe/backend/js/dtkt.subscribe.package",
        "dtkt.subscribe.orders": "subscribe/backend/js/dtkt.subscribe.orders",
        "dtkt.subscribe.details": "subscribe/backend/js/dtkt.subscribe.details",
        "dtkt.subscribe.templates": "subscribe/backend/js/dtkt.subscribe.templates",
        "dtkt.subscribe.packages": "subscribe/backend/js/dtkt.subscribe.packages",
        "dtkt.subscribe.sampling": "subscribe/backend/js/dtkt.subscribe.sampling",
        "dtkt.subscribe.statuses": "subscribe/backend/js/dtkt.subscribe.statuses",

        "dtkt.users": "users/backend/js/dtkt.users",
        "dtkt.users.autocomplete": "users/backend/js/dtkt.users.autocomplete",
        "dtkt.users.agencies": "users/backend/js/dtkt.users.agencies",
        "dtkt.users.managers": "users/backend/js/dtkt.users.managers",
        "dtkt.users.firms": "users/backend/js/dtkt.users.firms",

        "dtkt.webinars": "webinars/backend/js/dtkt.webinars"
    },
    "urlArgs": "0000000027"
});

define('jquery', [], function() { return jQuery; });
define('bootbox', [], function() { return bootbox; });
define('Highcharts', [], function() { return Highcharts; });
require(["jquery", "rabbitcms.backend"], function ($, RabbitCMS) {
    window.RabbitCMS = new RabbitCMS();

    $('body').removeClass('loading');
});