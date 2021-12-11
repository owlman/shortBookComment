const queryString = require('querystring');
const cookie = require('./cookie');

// 引入数据库连接对象
const sqliteDB = global.DBConnect;

module.exports = new Promise(function (resolve, reject) {
    // 查看数据库中是否已经存在 posts 表，如果不存在就创建它
    sqliteDB.schema.hasTable('posts')
    .then(function (exists) {
        if (exists == false) {
            // 设置 posts 表的字段
            return sqliteDB.schema.createTable('posts', function (table) {
                // 将 pid 字段设置为自动增长的字段，并将其设为主键
                table.increments('pid').primary();
                // 将用户 ID 字段设置为字符串类型的字段
                table.string('uid');
                // 将书籍 ID 字段设置为字符串类型的字段
                table.string('bid'); 
                // 将书评标题字段设置为字符串类型的字段
                table.string('postTitle'); 
                // 将书评内容字段设置为字符串类型的字段
                table.string('postContent'); 
                // 将出版日期设置为日期类型的字段
                table.dateTime('postDate')
            })
            .catch(message => responseError(res, {
                status: 500,
                message: message
            }));
        }
    })
    .then(function() {
        // 定义 posts 模块的 API
        const posts_api = {}

        // 处理书评信息查看请求
        posts_api.getData = function (req, res, responseError) {
            const query = req.url.split('/').pop();
            if (isNaN(Number(query)) === false) {
                sqliteDB('posts').select('*')
                .where('pid', query)
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

        // 列出指定用户发表的书评
        posts_api.getUserList = function (req, res, responseError) {
            const query = req.url.split('/').pop();
            if (isNaN(Number(query)) === false) {
                sqliteDB('posts').select('*')
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

        // 列出指定书籍的书评
        posts_api.getBookList = function (req, res, responseError) {
            const query = req.url.split('/').pop();
            if (isNaN(Number(query)) === false) {
                sqliteDB('posts').select('*')
                .where('bid', query)
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

        // 用于处理添加书评请求：
        posts_api.addData = function (req, res, responseError) {
            let formData = '';
            req.on('data', function (chunk) {
                formData += chunk;
            });
            req.on('end', function () {
                const postInfo = queryString.parse(formData.toString());
                if (postInfo !== {}) {
                    if (cookie.isLogin(req)) {
                        return responseError(res, {
                            status: 401,
                            message: 'premission_err'
                        });
                    }
                    sqliteDB('posts').insert({
                        uid : postInfo.uid,
                        bid : postInfo.bid,
                        postTitle : postInfo.postTitle,
                        postContent: postInfo.postContent,
                        postDate: postInfo.postDate
                    })
                    .then(function () {
                        res.writeHead(200, {
                            "Content-Type": "application/json"
                        });
                        res.end('post_added');
                    })
                    .catch(message => responseError(res, {
                        status: 500,
                        message: message
                    }));       
                } else {
                    responseError(res, {
                        status: 400,
                        message: 'post_signup_err'
                    });
                }
            });
        };

        // 用于处理书籍信息修改请求：
        posts_api.updateData = function (req, res, responseError) {
            const query = req.url.split('/').pop();
            if (isNaN(Number(query)) === false) {
                let formData = '';
                req.on('data', function (chunk) {
                    formData += chunk;
                });
                req.on('end', function () {
                    const bookInfo = queryString.parse(formData.toString());
                    if (bookInfo !== {}) {
                        if (cookie.checkPermission(req, postInfo.uid) == false) {
                            return responseError(res, {
                                status: 401,
                                message: 'premission_err'
                            });
                        }
                        sqliteDB('posts').update({
                            uid : postInfo.uid,
                            bid : postInfo.bid,
                            postTitle : postInfo.postTitle,
                            postContent: postInfo.postContent,
                            postDate: postInfo.postDate
                        })
                        .where('pid', query)
                        .then(function () {
                            res.writeHead(200, {
                                "Content-Type": "application/json"
                            });
                            res.end('book_added');
                        })
                        .catch(message => responseError(res, {
                            status: 500,
                            message: message
                        }));       
                    } else {
                        responseError(res, 'data_updated_err');
                    }
                });
            } else {
                responseError(res, {
                    status: 404,
                    message: 'query_err'
                });
            }
        };

        // 用于处理删除书评请求：
        posts_api.deleteData = async function (req, res, responseError) {
            const query = req.url.split('/').pop();
            if (isNaN(Number(query)) === false ) {
                if(cookie.isLogin(req) == false) {
                    const data = await sqliteDB('posts')
                            .select('uid').where('pid', query);
                    if (data.length > 0
                        && cookie.checkPermission(req, data[0].uid) === false) {
                        return responseError(res, {
                            status: 401,
                            message: 'premission_err'
                        });                   
                    } else if(data.length <= 0) {
                        return responseError(res, {
                            status: 400,
                            message: 'data_not_exist_err'
                        });
                    }
                }
                sqliteDB('posts').delete()
                .where('pid', query)
                .then(function () {
                    res.writeHead(200, {
                        "Content-Type": "application/json"
                    });
                    res.end('post_deleted');
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
        resolve(posts_api);
    });
});
