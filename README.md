# 短书评项目

## 项目概况

本项目是为[《Vue.js 全平台前端实战》](https://github.com/owlman/vuejs_in_action)一书编写的示例项目。该项目的后端是一个基于 RESTful 架构设计的 Web 服务，它基于 Node.js 平台与 Sqlite3 数据库来实现，将为前端提供以下 API：

| HTTP 请求方法 | 请求路径  | API 功能说明  |
| ---------------- |---------- |---------------------- |
| POST | `/users/session`   | 用于实现用户登录功能。|
| POST | `/users/newuser` | 用于实现新用户注册功能。|
| GET   | `/users/<用户的ID>` | 用于实现用户信息查看功能。 |
| POST | `/users/<用户的ID>` | 用于实现用户信息修改功能。 |
| DELETE | `/users/<用户的ID>` | 用于实现用户信息删除功能。|
| POST | `/books/newbook` | 用于实现添加新书籍的功能。|
| GET   | `/books/<书籍的ID>`  | 用于实现书籍信息查看功能。 |
| POST | `/books/<书籍的ID>`  | 用于实现书籍信息修改功能。|
| DELETE  | `/books/<书籍的ID>` | 用于实现书籍信息删除功能。|
| GET  | `/books/list/` | 用于列出所有书籍。     |
| POST | `/posts/newpost` | 用于实现添加新书评的功能。 |
| GET    | `/posts/<书评的ID>` | 用于实现书评帖子查看功能。|
| POST  | `/posts/<书评的ID>`  | 用于实现书评帖子修改功能。|
| DELETE | `/posts/<书评的ID>` | 用于实现书评帖子删除功能。|
| GET | `/posts/userlist/<用户的ID>` | 用于列出指定用户发表的所有书评。 |
| GET | `/posts/booklist/<书籍的ID>` | 用于列出指定书籍下面的所有书评。 |

该项目的前端主要分为两个部分：

- `webClient`部分：是一个基于 Vue.js 框架实现的纯 HTML5 前端项目，主要面向传统 PC 端浏览器。
- `mobileClient`部分：是一个基于 uni-app 框架实现的前端项目，主要面向手机、平板电脑等各移动端设备。
