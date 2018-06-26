const Config = (function () {
    function Config() {
    }
    Config.host = '//edu-portal-api.sightp.com';
    Config.checkoutLogin = '//passport.sightp.com/v4/token';
    Config.getUserInfo = '//passport.sightp.com/v4';
    Config.checkoutCharge = Config.host + '/passport/user';
    Config.rePwd = Config.host + '/passport/password';
    Config.categories = Config.host + '/categories';
    Config.getClassList = Config.host + '/mycourses';
    Config.mypackagesCommon = Config.host + '/mypackages';
    return Config;
}());
exports.Config = Config;