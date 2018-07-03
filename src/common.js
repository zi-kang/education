const Common = (function () {
    function Common() {
    }
    Common.getTime = function(addTime){
       let ms = parseInt(addTime) * 1000;
        let oDate = new Date(ms), oYear = oDate.getFullYear(), oMonth = oDate.getMonth() + 1, oDay = oDate.getDate(), oHours = oDate.getHours(), oMinu = oDate.getMinutes();
        oMonth = oMonth > 9 ? oMonth : '0' + oMonth;
        oDay = oDay > 9 ? oDay : '0' + oDay;
        oHours = oHours > 9 ? oHours : '0' + oHours;
        oMinu = oMinu > 9 ? oMinu : '0' + oMinu;
        let _time = oYear + '年' + oMonth + '月' + oDay + '日';
        return _time;
    }
    return Common;
}());
exports.Common = Common;