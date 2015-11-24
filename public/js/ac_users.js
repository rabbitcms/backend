var AutoCompleteUsers = function () {

    var status = {
        0: 'Не активний',
        1: 'Активний',
        2: 'Резерв',
        10: 'Видалений'
    };
    var timer;
    var cache = {};

    return {
        init: function (options) {
            options = $.extend(true, {
                acInput: '',
                acUrl: ''
            }, options);

            $.widget('ui.autocomplete', $.ui.autocomplete, {
                _renderItem: function (ul, item) {
                    return $('<li>')
                        .append($('<a>').html(item.label))
                        .appendTo(ul);
                }
            });

            $(options.acInput).autocomplete({
                minLength: 3,
                delay: 200,
                source: function (request, response) {
                    timer = setTimeout(function () {
                        clearTimeout(timer);
                        console.log(cache);

                        var term = request.term.trim().toLowerCase();
                        if (cache.hasOwnProperty(term)) {
                            response(cache[term]);
                            return;
                        }
                        $.getJSON(options.acUrl, request, function (data, s, xhr) {
                            response(cache[term] = data.map(function (item) {
                                var term = request.term.replace('%', '');
                                return {
                                    value: item.email,
                                    label: item.email.replace(term, '<strong>' + term + '</strong>') + ' - ' + status[item.active]
                                    + '<div style="font-size: 80%;">' + [item.lname, item.fname, item.mname].join(' ') + '</div>'
                                };
                            }));
                        });
                    }, 250);
                },
                select: function (event, ui) {
                    setTimeout(function () {
                        $(options.acInput).blur();
                    }, 50);
                }
            });
        }
    };
};