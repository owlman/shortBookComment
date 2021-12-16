# 短书评项目

本项目是为[《Vue.js 全平台前端实战》](https://github.com/owlman/vuejs_in_action)一书编写的示例项目。

## 开发环境

- 运行平台：Node.js
- 开发语言：JavaScript
- 开发框架：Vue.js, uni-app
- 数据库   ：SQLite3

## 项目概况

该项目的后端是一个基于 RESTful 架构设计的 Web 服务，它基于 Node.js 运行平台与 Sqlite3 数据库来实现，将为前端提供以下 API：

| HTTP 请求方法 | 请求路径                           |  功能说明                                 |
| ---------------- | --------------------------- | -------------------------------- |
| POST                | `/users/session`                  | 用于实现用户登录功能。           |
| POST                | `/users/newuser`                | 用于实现新用户注册功能。         |
| GET                   | `/users/<用户的ID>`            | 用于实现用户信息查看功能。    |
| POST                 | `/users/<用户的ID>`           | 用于实现用户信息修改功能。     |
| DELETE              | `/users/<用户的ID>`          | 用于实现用户信息删除功能。      |
| POST                 | `/books/newbook`             | 用于实现添加新书籍的功能。      |
| GET                   | `/books/<书籍的ID>`          | 用于实现书籍信息查看功能。      |
| POST                 | `/books/<书籍的ID>`         | 用于实现书籍信息修改功能。      |
| DELETE              | `/books/<书籍的ID>`        | 用于实现书籍信息删除功能。       |
| GET                   | `/books/list/`                       | 用于列出所有书籍。                   |
| POST                | `/posts/newpost`               | 用于实现添加新书评的功能。       |
| GET                  | `/posts/<书评的ID>`            | 用于实现书评帖子查看功能。      |
| POST                | `/posts/<书评的ID>`          | 用于实现书评帖子修改功能。       |
| DELETE             | `/posts/<书评的ID>`         | 用于实现书评帖子删除功能。       |
| GET                   | `/posts/userlist/<用户的ID>` | 用于列出指定用户发表的所有书评。 |
| GET                   | `/posts/booklist/<书籍的ID>` | 用于列出指定书籍下面的所有书评。 |

该项目的前端主要分为两个部分：

- `webClient`部分：是一个基于 Vue.js 框架实现的纯 HTML5 前端项目，主要面向传统 PC 端浏览器。
- `mobileClient`部分：是一个基于 uni-app 框架实现的前端项目，主要面向手机、平板电脑等各移动端设备。

## 部署方法

- 先用 git 将本项目克隆到计算机的某一指定目录中：
  
   ```bash
   git clone git@github.com:owlman/shortBookComment.git
   
   #中国大陆用户也可以使用项目在国内的镜像：
   git clone git@gitee.com:owlman/short-book-comment.git
   ```

- 接着进入到项目根目录中，并执行以下命令构建项目的`webClient`部分：

   ```bash
   cd webClient 
   npm install
   npm run build 
   ```

- 然后在项目根目录中执行以下命令构建项目的`mobileClient`部分（也可以使用 HBuilderX 集成环境打开`mobileClient/src`目录进行自动化构建）：

   ```bash
   cd mobileClient
   npm install 
   npm run dev:[%PLATFORM%]
   ```

   在这里，编译变量`%PLATFORM%`的作用是指定编译工作所要面向的运行平台，该变量可取值如下：

    | %PLATFORM% 的值 | 运行平台      |
    | --------------------- | -------------- |
    | h5                           | H5                 |
    | mp-alipay               | 支付宝小程序 |
    | mp-baidu               | 百度小程序     |
    | mp-weixin              | 微信小程序     |
    | mp-toutiao            | 字节小程序     |
    | mp-qq                   | qq 小程序       |

- 最后在项目根目录中执行`nodemon .`命令启动项目的后端服务。当然，在这之前需先安装 nodemon 工具（安装命令为`npm install nodemon -g`）。
