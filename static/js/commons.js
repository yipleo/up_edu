/**
 * 扩展验证框架规则
 */
$.validator.config({
    rules: {
        loginName: [/^[a-zA-Z]{1}([a-zA-Z0-9]|[._]){4,19}$/, "用户名必须是6-20位，首字母数字组合"],
        checkUsername: function (element) {
            return $.ajax({
                url: "/checkLoginName",
                type: "post",
                data: {loginName: element.value},
                dataType: "json"
            });
        },
        checkMail: function (element) {
            return $.ajax({
                url: "/checkMail",
                type: "post",
                data: {mail: element.value},
                dataType: "json"
            });
        }
    }
});

/**
 * 消息弹窗
 */
var dialog = {
    //消息
    msg: function (message, callback, timeout) {
        var options = {
            message: message,
            size: "small",
            className: "msg",
            animate: true,
            backdrop: true,
            onEscape: callback
        };
        bootbox.dialog(options);

        if (timeout != null) {
            var time = setInterval(function () {
                timeout--;
                if (timeout === 0) {
                    clearInterval(time);
                    bootbox.hideAll();
                    if (typeof callback === "function") {
                        callback.call(this);
                    }
                }
            }, 1000);
        }
    }
};

/**
 * 订单状态
 */
function getOrderStatus(status, row) {
    var result = '';
    switch (status) {
        case "已支付":
            result = '<span class="order-status-icon order-status-type-6">已支付</span>';
            if (row.timeRemaining != "") {
                result += '<br/><span class="order-status-icon order-time">' + row.timeRemaining + '</span>';
            }
            break;
        case "分配写手":
            result = '<span class="order-status-icon order-status-type-2">分配写手</span>';
            if (row.timeRemaining != "") {
                result += '<br/><span class="order-status-icon order-time">' + row.timeRemaining + '</span>';
            }
            break;
        case "进行中":
            result = '<span class="order-status-icon order-status-type-2">进行中</span>';
            if (row.timeRemaining != "") {
                result += '<br/><span class="order-status-icon order-time">' + row.timeRemaining + '</span>';
            }
            break;
        case "待确认":
            result = '<span class="order-status-icon order-status-type-4">待确认</span>';
            break;
        case "修改中":
            result = '<span class="order-status-icon order-status-type-2">修改中</span>';
            break;
        case "退款中":
            result = '<span class="order-status-icon order-status-type-5">退款中</span>';
            break;
        case "已退款":
            result = '<span class="order-status-icon order-status-type-7">已退款</span>';
            break;
        case "已确认":
            result = '<span class="order-status-icon order-status-type-7">已确认</span>';
            break;
        default:
            result = '<span class="order-status-icon order-status-type-1">待支付</span>';
    }
    return result;
}

/**
 * 支付
 */
function pay(e, orderId) {
    // .addClass("disabled");
    $(e).button("loading");
    $.post("/order/pay", {orderId: orderId}, function (res) {
        if (res.flag) {
            // window.open(res.data, "_blank");
            location.href = res.data;
        }
    }, "json");
}

// Extend the default Number object with a formatMoney() method:
// usage: someVar.formatMoney(decimalPlaces, symbol, thousandsSeparator, decimalSeparator)
// defaults: (2, "$", ",", ".")
Number.prototype.formatMoney = function (places, symbol, thousand, decimal) {
    places = !isNaN(places = Math.abs(places)) ? places : 2;
    symbol = symbol !== undefined ? symbol : "$";
    thousand = thousand || ",";
    decimal = decimal || ".";
    var number = this,
        negative = number < 0 ? "-" : "",
        i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "",
        j = (j = i.length) > 3 ? j % 3 : 0;
    return symbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
};