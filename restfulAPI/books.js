const queryString = require('querystring');
const cookie = require('./cookie');

// 引入数据库连接对象
const sqliteDB = global.DBConnect;

module.exports = new Promise(function (resolve, reject) {
    // 查看数据库中是否已经存在 books 表，如果不存在就创建它
    sqliteDB.schema.hasTable('books')
    .then(function (exists) {
        if (exists == false) {
            // 设置 books 表的字段
            return sqliteDB.schema.createTable('books', function (table) {
                // 将 bid 字段设置为自动增长的字段，并将其设为主键
                table.increments('bid').primary();
                // 将书名字段设置为字符串类型的字段
                table.string('bookName');
                // 将封面图字段设置为二进制类型的字段 
                table.binary('bookFace')
                // 将作者字段设置为字符串类型的字段
                table.string('authors'); 
                // 将出版社字段设置为字符串类型的字段
                table.string('publishingHouse'); 
                // 将出版日期设置为日期类型的字段
                table.dateTime('publishDate');
            })
            .catch(message => responseError(res, {
                status: 500,
                message: message
            }));
        }
    })
    .then(function() {
        // 定义 books 模块的 API
        const books_api = {}

        // 处理书籍信息查看请求
        books_api.getData = function (req, res, responseError) {
            const query = req.url.split('/').pop();
            if (isNaN(Number(query)) === false) {
                sqliteDB('books').select('*')
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

        // 获取书籍列表
        books_api.getList = function (res, responseError) {
            sqliteDB('books').select('*')
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
        };

        // 用于处理添加书籍请求：
        books_api.addData = function (req, res, responseError) {
            if (cookie.isLogin(req)) {
                let formData = '';
                req.on('data', function (chunk) {
                    formData += chunk;
                });
                req.on('end', function () {
                    const bookInfo = queryString.parse(formData.toString());
                    if (bookInfo !== {}) {
                        sqliteDB('books').insert({
                            bookName : bookInfo.bookName,
                            bookFace : bookInfo.bookFace,
                            authors : bookInfo.authors,
                            publishingHouse: bookInfo.publishingHouse,
                            publishDate: new Date(bookInfo.publishDate)
                        })
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
                        responseError(res, {
                            status: 400,
                            message: 'book_signup_err'
                        });
                    }
                });
            } else {
                return responseError(res, {
                    status: 401,
                    message: 'premission_err'
                });
            }
        };

        // 用于处理书籍信息修改请求：
        books_api.updateData = function (req, res, responseError) {
            const query = req.url.split('/').pop();
            if (isNaN(Number(query)) === false) {
                if (cookie.isAdmin(req) === false) {
                    return responseError(res, {
                        status: 401,
                        message: 'premission_err'
                    });
                }
                let formData = '';
                req.on('data', function (chunk) {
                    formData += chunk;
                });
                req.on('end', function () {
                    const bookInfo = queryString.parse(formData.toString());
                    if (bookInfo !== {}) {
                        sqliteDB('books').insert({
                            bookName : bookInfo.bookName,
                            bookFace : bookInfo.bookFace,
                            authors : bookInfo.authors.join(';'),
                            publishingHouse: bookInfo.publishingHouse,
                            publishDate: new Date(bookInfo.publishDate)
                        })
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
                        responseError(res, {
                            status: 400,
                            message: 'data_updated_err'
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

        // 用于处理删除书籍请求：
        books_api.deleteData = function (req, res, responseError) {
            const query = req.url.split('/').pop();
            if (isNaN(Number(query)) === false) {
                if (cookie.isAdmin(req) === false) {
                    return responseError(res, {
                        status: 401,
                        message: 'premission_err'
                    });
                }
                sqliteDB('books').delete()
                .where('bid', query)
                .then(function () {
                    res.writeHead(200, {
                        "Content-Type": "application/json"
                    });
                    res.end('book_deleted');
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
        resolve(books_api);
    });
});
