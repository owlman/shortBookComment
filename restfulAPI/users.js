const queryString = require('querystring');
const cookie = require('./cookie');

// 引入数据库连接对象
const sqliteDB = global.DBConnect;

module.exports = new Promise(function (resolve, reject) {
    // 查看数据库中是否已经存在 users 表，如果不存在就创建它
    sqliteDB.schema.hasTable('users')
    .then(function (exists) {
        if (exists == false) {
            // 创建 users 表的字段
            return sqliteDB.schema.createTable('users', function (table) {
                // 将 uid 字段设置为自动增长的字段，并将其设为主键
                table.increments('uid').primary();
                // 将用户名字段设置为字符串类型的字段
                table.string('userName'); 
                // 将密码字段设置为字符串类型的字段
                table.string('password'); 
            })
            .catch(message => responseError(res, {
                status: 500,
                message: message
            }));
        }
    })
    .then(function() {
        // 定义 users 模块的 API
        const users_api = {}

        // 处理用户登录请求
        users_api.login = function (req, res, responseError) {
            let formData = '';
            req.on('data', function (chunk) {
                formData += chunk;
            });
            req.on('end', function () {
                const tmp = queryString.parse(formData.toString());
                if (tmp.user || tmp.passwd) {
                    sqliteDB('users').select('uid')
                    .where('userName', tmp.user)
                    .andWhere('password', tmp.passwd)
                    .then(function (data) {
                        if (data.length == 0) {
                            return responseError(res, {
                                status: 401,
                                message: 'uname_passwd_err'
                            });
                        }
                        res.writeHead(200, {
                            'Set-Cookie': cookie.serialize({
                                'uid': data[0].uid
                            }),
                            "Content-Type": "application/json"
                        });
                        res.end(JSON.stringify(data));
                    })
                    .catch(message => responseError(res, {
                        status: 500,
                        message: message
                    }));
                } else {
                    responseError(res, {
                        status: 400,
                        message: 'login_parameter_err'
                    });
                }
            });
        };

        // 处理用户信息查看请求
        users_api.getData = function (req, res, responseError) {
            const query = req.url.split('/').pop();
            if (isNaN(Number(query)) === false) {
                if (cookie.checkPermission(req, query) == false) {
                    return responseError(res, {
                        status: 401,
                        message: 'premission_err'
                    });
                }
                sqliteDB('users').select('*')
                .where('uid', query)
                .then(function (data) {
                    res.writeHead(200, {
                        "Content-Type": "application/json"
                    });
                    res.end(JSON.stringify(data));
                })
                .catch(message => responseError(res, {
                    status: 500,
                    message: message
                }));    
            } else {
                responseError(res, {
                    status: 404,
                    message: 'query_err'
                });
            }
        };

        // 用于处理用户注册请求：
        users_api.addUser = function (req, res, responseError) {
            let formData = '';
            req.on('data', function (chunk) {
                formData += chunk;
            });
            req.on('end', async function () {
                const tmp = queryString.parse(formData.toString());
                const newUser = {
                    userName: tmp.user,
                    password: tmp.passwd
                };
                if (newUser.userName || newUser.password) {
                    const data = await sqliteDB('users')
                        .select('uid').where('userName', newUser.userName);
                    if(data.length > 0) {
                        responseError(res, {
                            status: 403,
                            message: 'uname_exist_err'
                        });
                    } else {
                        sqliteDB('users').insert(newUser)
                        .then(function () {
                            res.writeHead(200, {
                                "Content-Type": "application/json"
                            });
                            res.end('user_added');
                        })
                        .catch(message => responseError(res, {
                            status: 500,
                            message: message
                        }));                
                    }        
                } else {
                    responseError(res, {
                        status: 400,
                        message: 'users_signup_err'
                    });
                }
            });
        };

        // 用于处理用户信息修改请求：
        users_api.updateData = function (req, res, responseError) {
            const query = req.url.split('/').pop();
            if (isNaN(Number(query)) === false) {
                if (cookie.checkPermission(req, query) == false) {
                    return responseError(res, {
                        status: 401,
                        message: 'premission_err'
                    });
                }
                let formData = '';
                req.on('data', function (chunk) {
                    formData += chunk;
                });
                req.on('end', async function () {
                    const tmp = queryString.parse(formData.toString());
                    const newUser = {
                        userName: tmp.user,
                        password: tmp.passwd
                    };
                    if (newUser.userName || newUser.password) {
                        const data = await sqliteDB('users')
                            .select('uid').where('userName', newUser.userName);
                        if(data.length > 0 && data[0].uid != query) {
                            responseError(res, {
                                status: 403,
                                message: 'uname_exist_err'
                            });
                        } else {
                            sqliteDB('users').update(newUser)
                            .where('uid', query)
                            .then(function () {
                                res.writeHead(200, {
                                    "Content-Type": "application/json"
                                });
                                res.end('user_updated');
                            })
                            .catch(message => responseError(res, {
                                status: 500,
                                message: message
                            }));
                        }
                    } else {
                        responseError(res, {
                            status: 400,
                            message: 'updata_pram_err'
                       });
                }
                });
            } else {
                responseError(res, {
                    status: 404,
                    message: 'query_err'
                });
            }
        };

        // 用于处理删除用户请求：
        users_api.deleteData = function (req, res, responseError) {
            const query = req.url.split('/').pop();
            if (isNaN(Number(query)) === false) {
                if (cookie.isAdmin(req) === false
                    && cookie.checkPermission(req, query) == false) {
                    return responseError(res, {
                        status: 401,
                        message: 'premission_err'
                    });
                }
                sqliteDB('users').delete()
                .where('uid', query)
                .then(function () {
                    res.writeHead(200, {
                        "Content-Type": "application/json"
                    });
                    res.end('user_deleted');
                })
                .catch(message => responseError(res, {
                    status: 500,
                    message: message
                }));    
            } else {
                responseError(res, {
                    status: 404,
                    message: 'query_err'
                });
            }
        };
        resolve(users_api);
    });
});
