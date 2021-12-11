const path = require('path');
const knex = require('knex');

// 响应错误信息
function responseError(res, err) {
    res.writeHead(err.status, {
        "Content-Type": "application/json"
    });
    return res.end(err.message);
}

// 设置数据库文件路径：
const DBPath = path.join(__dirname, '../database/sqlite3db.sqlite');

// 创建数据库连接对象：
global.DBConnect = knex({
    client: 'sqlite3',
    connection: {
        filename: DBPath
    },
    debug: true, // 在生产环境下可设置为 false
    pool: {
        min: 2,
        max: 7
    },
    useNullAsDefault: true
});

// 处理 GET 请求：
module.exports.getRequest = function (req, res) {
    const reqParam = req.url.split('/');
    if(reqParam.length < 1 || reqParam.length > 4) {
        return responseError(res, {
            status: 400,
            message: 'request_url_err'
        });
    }
    
    if (reqParam[1] === 'users') {
        const users = require('./users');
        users.then(function(api) {
            api.getData(req, res, responseError);
        });
    } else if (reqParam[1] === 'books') {
        const books = require('./books');
        books.then(function(api) {
            if (reqParam[2] === 'list') {
                api.getList(res, responseError);
            } else {
                api.getData(req, res, responseError);
            }
        });
    } else if (reqParam[1] === 'posts') {
        const posts = require('./posts');
        posts.then(function(api) {
            if (reqParam[2] === 'userlist') {
                api.getUserList(req, res, responseError);
            } else if(reqParam[2] === 'booklist') {
                api.getBookList(req, res, responseError);
            } else {
                api.getData(req, res, responseError);
            }
        });
    } else {
        responseError(res, {
            status: 400,
            message: 'request_url_err'
        });
    }
}

// 处理 POST 请求：
module.exports.postRequest = function (req, res) {
    const reqParam = req.url.split('/');
    if(reqParam.length < 1 || reqParam.length > 4) {
        return responseError(res, {
            status: 400,
            message: 'request_url_err'
        });
    }

    if (reqParam[1] === 'users') {
        const users = require('./users');
        users.then(function(api) {
            if (reqParam[2] === 'newuser') {
                api.addUser(req, res, responseError);
            } else if (reqParam[2] === 'session') {
                api.login(req, res, responseError);
            } else {
                api.updateData(req, res, responseError);
            }
        });
    } else if (reqParam[1] === 'books') {
        const books = require('./books');
        books.then(function(api) {
            if (reqParam[2] === 'newbook') {
                api.addData(req, res, responseError);
            } else {
                api.updateData(req, res, responseError);
            }
        });
    } else if (reqParam[1] === 'posts') {
        const posts = require('./posts');
        posts.then(function(api) {
            if (reqParam[2] === 'newpost') {
                api.addData(req, res, responseError);
            } else {
                api.updateData(req, res, responseError);
            }
        });
    } else {
        responseError(res, {
            status: 400,
            message: 'request_url_err'
        });
    }
};

// 处理 DELETE 请求：
module.exports.deleteRequest = function (req, res) {
    const reqParam = req.url.split('/');
    if(reqParam.length < 1 || reqParam.length > 3) {
        return responseError(res, {
            status: 400,
            message: 'request_url_err'
        });
    }

    if (reqParam[1] === 'users') {
        const users = require('./users');
        users.then(function(api) {
            api.deleteData(req, res, responseError);
        });
    } else if (reqParam[1] === 'books') {
        const books = require('./books');
        books.then(function(api) {
            api.deleteData(req, res, responseError);
        });
    } else if (reqParam[1] === 'posts') {
        const posts = require('./posts');
        posts.then(function(api) {
            api.deleteData(req, res, responseError);
        });
    } else {
        responseError(res, {
            status: 400,
            message: 'request_url_err'
        });
    }
};
