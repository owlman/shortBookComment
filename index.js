const http = require('http');
const path = require('path');
const fs = require('fs');
const restful_api = require('./restfulAPI');

// 设置服务器的端口号
const port = 3000;
// 设置主机名
const host = `http://localhost:${port}/`;

// 定义 Web 服务
function webServer(req, res) {
    const webroot = '/webClient/dist';
    // console.log(webroot + req.url)
    fs.readFile(`.${webroot + req.url}`, function (err, data) {
        if (err !== null) {
            res.writeHead(404, {
                'Content-Type': 'text/html, charset=utf-8'
            });
            return res.end('相关页面不存在！');
        }
        res.writeHead(200);
        res.end(data);
    });
}

// 定义 RESTful 服务
function restfulServer(req, res) {
    switch (req.method) {
        case 'GET':
            restful_api.getRequest(req, res);
            break;
        case 'POST':
            restful_api.postRequest(req, res);
            break;
        case 'DELETE':
            restful_api.deleteRequest(req, res);
            break;
    }
}

// 构建 HTTP 服务
http.createServer(function (req, res) {
    req.url = (req.url == '/' ? '/index.html' : req.url);
    // 设置允许服务的静态资源类型
    const extNames = [
        '.html', '.js',
        '.css', '.jpg',
        '.png', '.ico'
    ];
    // 判断前端请求的服务类型
    if (extNames.includes(path.extname(req.url))) {
        webServer(req, res);
    } else {
        restfulServer(req, res);
    }
}).listen(port, function () {
    console.log(`请访问${host}，按Ctrl+C终止服务！`);
});
