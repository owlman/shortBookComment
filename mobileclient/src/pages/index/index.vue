<template>
	<view class="content">
        <view v-if="user.isLogin">
            <image class="logo" src="/static/logo.png"></image>
            <view class="text-area">
                <text class="title">{{title}}</text>            
            </view>
            <view class="book-comment">
                <view class="list-title">
                    <text>你已发布的书评：</text>
                </view>            
                <view class="comment-list">
                    <uni-list>
                        <uni-list-item v-for="post in posts" :key="post.pid"
                            :title="post.postTitle"
                            link="navigateTo"
                            to="/pages/post/post"
                        />
                    </uni-list>
                </view>            
            </view>
            <view class="formBtn">
                <button @click="logout">退出登录</button>
            </view>
  		</view>
        <view v-if="!user.isLogin">
            <image class="logo" src="/static/logo.png"></image>
            <text class="title">请先登录你的账户：</text>            
            <form class="form" @submit="login">
                <view class="inputWrapper">
                    <input name="userName" placeholder="请输入用户名" />
                </view>
                <view class="inputWrapper">
                    <input name="password" password="true" placeholder="请输入密码" />
                </view>
                <view class="formBtn">
                    <button class="submit" form-type="submit">登录</button>
                    <button class="reset" form-type="reset">重置</button>
                </view>
            </form>
            <navigator url="/pages/signup/signup"> >>> 新用户注册</navigator>
        </view>
	</view>
</template>
<script>
    import md5 from 'blueimp-md5';
    import { uniList, uniListItem } from '@dcloudio/uni-ui';

    export default {
        components: { uniList, uniListItem },
		data: function() {
			return {
                posts: [],
				title: '',
                user: {
                    uid: "",
                    isLogin: false
                }
			}
		},
		onLoad: function() {
            // 这是页面 load 事件的处理函数
            // 事件在页面载入时被触发
            const that = this;
            uni.getStorage({
                key: 'user',
                success: function (res) {
                    // 获取到的数据存储在 res.data 对象中。
                    // console.log(res.data);
                    that.user = JSON.parse(res.data);
                    if(that.user.isLogin) {
                        that.getUserMessage(that.user.uid);
                        that.getUserPosts(that.user.uid)
                    }
                }
            });
		},
		methods: {
            login: function(event) {
                // 这是表单 submit 事件的处理函数
                const formdata = event.detail.value;
                const userData =  {
                    user : formdata.userName,
                    passwd : md5(formdata.password)
                };
                const that = this;
                uni.request({
                    method  : 'POST',
                    url  : 'http://localhost:3000/users/session',
                    header : {    // 为正确提交表单数据，这项头信息设置必不可少
                        'content-type': 'application/x-www-form-urlencoded'
                    },
                    data :  userData,
                    success :  function(res) {
                        // 返回的响应数据存储在 res.data 对象中
                        // console.log(res.data);
                        if(res.statusCode === 200) {
                            that.user.uid = res.data[0].uid;
                            that.user.isLogin = true;
                            uni.setStorage({
                                key: 'user',
                                data: JSON.stringify(that.user),
                                success: function () {
                                    // 登录成功并获取用户信息
                                    // console.log('setStorage success');
                                    that.getUserMessage(that.user.uid);
                                    that.getUserPosts(that.user.uid)
                                }
                            });
                        }  else if(res.statusCode === 400) {
                            uni.showToast({
                                    title : '请输入用户名和密码',
                                    icon : 'error'
                            });
                        }  else if(res.statusCode === 401) {
                            uni.showToast({
                                title : '请确认用户名和密码',
                                icon : 'error'
                           });
                        } else if(res.statusCode === 500) {
                            uni.showToast({
                                title : '数据库错误信息',
                                icon : 'error'
                           });
                        } 
                    },
                    fail :  function(err) {
                        // 返回的错误存储在 err 对象中
                        uni.showToast({
                            title : '登录请求出错',
                            icon : 'error'
                        });
                    }
                });
            },
            logout: function() {
                this.user.isLogin = false;
                this.user.uid = "";
                uni.removeStorage({
                    key: 'user',
                    success: function () {
                        // console.log('removeStorage success');
                        uni.showToast({
                            title : '用户已经成功登出',
                            icon : 'success'
                        });
                    }
                });
            },
            getUserMessage: function(uid) {
                const that = this;
                uni.request({
                    url : 'http://localhost:3000/users/'+uid,
                    header: { // 请务必记得手动设置 cookie，以传递登录状态
                        'cookie': 'uid='+that.user.uid
                    },
                    success : function(res) {
                        // 返回的响应数据存储在 res.data 对象中
                        // console.log(res.data[0]);
                        if(res.statusCode === 404) {
                            uni.showToast({
                                title : '被查询的用户不存在',
                                icon : 'error'
                            });
                        }  else if(res.statusCode === 401) {
                             uni.showToast({
                                title : '无权限查看该用户信息',
                                icon : 'error'
                            });
                        } else if(res.statusCode === 500) {
                            uni.showToast({
                                title : '数据库错误信息',
                                icon : 'error'
                            });                        
                        } else if(res.statusCode === 200) {
                             that.title = `欢迎回来，${res.data[0].userName}！`;
                        }
                    },
                    fail :  function(err) {
                        uni.showToast({
                            title : '服务器不响应',
                            icon : 'error'
                        });
                    }
                });
            },
            getUserPosts: function(uid) {
                const that = this;
                uni.request({
                    method : 'GET',
                    url : 'http://localhost:3000/posts/userlist/'+uid,
                    success : function(res) {
                        if(res.statusCode === 200) {
                            that.posts = res.data;
                       }  else if(res.statusCode === 500)  {
                            uni.showToast({
                                title : '数据库错误信息',
                                icon : 'error'
                            });
                        } else if(res.statusCode === 404)  {
                            uni.showToast({
                                title : '当前用户还没有评论',
                                icon : 'error'
                            });
                        }
                    },
                    fail: function(err) {
                        uni.showToast({
                            title : '服务器不响应',
                            icon : 'error'
                        });
                    }
                });
            }
		}
	}
</script>
<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	
    .logo {
		display: flex;
		height: 300rpx;
		width: 300rpx;
		margin-top: 120rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 80rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 40rpx;
		color: gray;
	}

    .form{
		padding: 0 200rpx;
		margin-top: 40rpx;
	}

    .inputWrapper{
		width: 100%;
		height: 80rpx;
		border-radius: 20rpx;
        border-style: groove;
		box-sizing: border-box;
		padding: 0 20rpx;
		margin-top: 25rpx;
	}
	
    .inputWrapper .input{
		width: 100%;
		height: 100%;
		text-align: center;
		font-size: 15rpx;
	}
	
    .formBtn{
		width: 100%;
		height: 80rpx;
		margin-top: 50rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		
	}
    
    .submit {
        width: 45%;
		border-radius: 25rpx;
        color:white;
        background-color: black;
    }
    
    .reset {
        width: 45%;
		border-radius: 25rpx;
        background-color: lightgray;
    }

    .book-comment {
        margin-top: 10%;
        margin-bottom: 10%;
    }
</style>
