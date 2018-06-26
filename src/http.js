const $ = window.$;

const Http = /** @class */ (function () {
    function Http() {
    }
    Http.withCredentials = function () {
        return {
            xhrFields: {
                withCredentials: true
            }
        };
    };
    Http.get = function (url, params, successCallback, errorCallback, opts) {
        this.send('GET', url, params, successCallback, errorCallback, opts);
    };
    Http.getToBody = function (url, params, successCallback, errorCallback, opts) {
        this.sendToBody('GET', url, params, successCallback, errorCallback, opts);
    };
    Http.delete = function (url, params, successCallback, errorCallback, opts) {
        if (params) {
            if (url.indexOf('?') > 0) {
                url += '&';
            }
            else {
                url += '?';
            }
            if (typeof params == "string") {
                url += params;
            }
            else {
                var arr = [];
                for (var item in params) {
                    arr.push(item + '=' + params[item]);
                }
                url += arr.join('&');
            }
        }
        this.send('DELETE', url, params, successCallback, errorCallback, opts);
    };
    Http.deleteToBody = function (url, params, successCallback, errorCallback, opts) {
        if (params) {
            if (url.indexOf('?') > 0) {
                url += '&';
            }
            else {
                url += '?';
            }
            if (typeof params == "string") {
                url += params;
            }
            else {
                var arr = [];
                for (var item in params) {
                    arr.push(item + '=' + params[item]);
                }
                url += arr.join('&');
            }
        }
        this.sendToBody('DELETE', url, params, successCallback, errorCallback, opts);
    };
    Http.getJSONP = function (url, params, successCallback, errorCallback, opts) {
        if (url.indexOf('?') > 0) {
            url += '&callback=?';
        }
        else {
            url += '?callback=?';
        }
        this.send('GET', url, params, successCallback, errorCallback, opts);
    };
    Http.post = function (url, params, successCallback, errorCallback, opts) {
        this.send('post', url, params, successCallback, errorCallback, opts);
    };
    Http.put = function (url, params, successCallback, errorCallback, opts) {
        this.send('PUT', url, params, successCallback, errorCallback, opts);
    };
    Http.putToFile = function (url, params, successCallback, errorCallback, progressCallback, opts) {
        var xhr;
        if (!opts)
            opts = {};
        opts.contentType = false;
        opts.processData = false;
        opts.xhr = function () {
            xhr = $.ajaxSettings.xhr();
            xhr.upload.addEventListener('progress', function (e) {
                if (progressCallback) {
                    progressCallback.call(this, {
                        loaded: e.loaded,
                        total: e.total
                    });
                }
            }, false);
            return xhr;
        };
        this.send('PUT', url, params, successCallback, errorCallback, opts);
        return xhr;
    };
    Http.update = function (url, params, successCallback, errorCallback, opts) {
        this.send('UPDATE', url, params, successCallback, errorCallback, opts);
    };
    Http.putToBody = function (url, params, successCallback, errorCallback, opts) {
        this.sendToBody('PUT', url, params, successCallback, errorCallback, opts);
    };
    Http.sendToBody = function (method, url, params, successCallback, errorCallback, opts) {
        if (!opts)
            opts = {};
        opts.contentType = 'application/json; charset=utf-8';
        var str = typeof params != 'string' ? JSON.stringify(params) : params;
        this.send(method, url, str, successCallback, errorCallback, opts);
    };
    Http.postToBody = function (url, params, successCallback, errorCallback, opts) {
        this.sendToBody('POST', url, params, successCallback, errorCallback, opts);
    };
    Http.postFile = function (url, params, successCallback, errorCallback, progressCallback, opts) {
        var xhr;
        if (!opts)
            opts = {};
        opts.contentType = false;
        opts.processData = false;
        opts.xhr = function () {
            xhr = $.ajaxSettings.xhr();
            xhr.upload.addEventListener('progress', function (e) {
                if (progressCallback) {
                    progressCallback.call(this, {
                        loaded: e.loaded,
                        total: e.total
                    });
                }
            }, false);
            return xhr;
        };
        this.send('POST', url, params, successCallback, errorCallback, opts);
        return xhr;
    };
    Http.send = function (method, url, params, successCallback, errorCallback, opts) {
        var _this = this;
        var settings = {
            data: params,
            dataType: 'JSON',
            method: method,
            success: successCallback,
            error: function (jqXHR) {
                if (errorCallback)
                    errorCallback.call(_this, jqXHR);
            },
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", localStorage['educationToken']);
            }
        };
        if (opts) {
            for (var item in opts) {
                settings[item] = opts[item];
            }
        }
        $.ajax(url, settings);
    };
    return Http;
}());
exports.Http = Http;