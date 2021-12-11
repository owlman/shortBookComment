// 将 cookie 解析成 JavaScript 对象：
module.exports.parse = function (cookiesString) {
    let cookies = {};
    if (!cookiesString) {
        return cookies;
    }
    const tmpList = cookiesString.split(';');
    for (let i = 0; i < tmpList.length; ++i) {
        const pair = tmpList[i].split('=');
        cookies[pair[0].trim()] = pair[1];
    }
    return cookies;
};

// 将 JavaScript 对象序列化成 cookie：
module.exports.serialize = function (cookies) {
    const pair = new Array();
    for (const name in cookies) {
        pair.push(`${name}=${cookies[name]}`);
    }
    return pair.join(';');
};

// 用于验证用户是否已经登录：
module.exports.isLogin = function(req) {
    const cookies = this.parse(req.headers.cookie);
    return cookies.isLogin === 'true';
}

// 用于验证用户权限：
module.exports.checkPermission = function (req, query) {
    const cookies = this.parse(req.headers.cookie);
    console.log(cookies.uid);
    
    return cookies.uid === query;
};

// 用于验证管理员权限：
module.exports.isAdmin = function(req) {
    const cookies = this.parse(req.headers.cookie);
    return cookies.uid === '1';
}
