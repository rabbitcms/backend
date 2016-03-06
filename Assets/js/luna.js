var Luna = (function () {
    'use strict';
    function Luna(code, len) {
        return Luna.check(code, len);
    }

    function sum(code) {
        var len = code.length, s = 0, n;
        for (var i = 0; i < len; ++i) {
            if (i % 2) {
                n = (code[len - 1 - i] * 2);
                if (n > 9) n = n - 9;
            } else {
                n = code[len - 1 - i] - 0;
            }
            s += n;
        }
        return s;
    }

    Luna.check = function check(code, len) {
        code = new String(code).replace(/\D/g, '');
        if (code.length != len) return false;
        return sum(code) % 10 == 0;
    };

    Luna.gen = function gen(len) {
        var code = new Array(len);
        for (var i = 0; i < len; ++i) {
            code[i] = parseInt(Math.random() * 10) % 10;
        }
        code[len - 1] = 0;
        if (sum(code) % 10 != 0)
            code[len - 1] = 10 - sum(code) % 10;
        return code.join('');
    };

    return Luna;
})();