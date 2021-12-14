<template>
	<view class="content">
        <view  v-if="isLogin">
            <image class="logo" src="/static/logo.png"></image>
            <text class="title">修改用户信息：</text>            
            <form class="form" @submit="updateUser">
                <view class="inputWrapper">
                    <input name="userName" v-model="user.userName" />
                </view>
                <view class="inputWrapper">
                    <input name="password" password="true" placeholder="请输入新密码" />
                </view>
                <view class="inputWrapper">
                    <input name="repassword" password="true" placeholder="请重复密码" />
                </view>
                <view class="formBtn">
                    <button class="submit" form-type="submit">保存</button>
                    <button class="reset" form-type="reset">重置</button>
                </view>
            </form>
        </view>
    </view>  
</template>
<script>
    import md5 from 'blueimp-md5';

    export default {
        data: function() {
            return {
                isLogin: false,
                user: []
            }
        },
        onShow: function() {
            // 这是页面 show 事件的处理函数
            const that = this;
            uni.getStorage({
                key: 'user',
                success: function (res) {
                    // 获取到的数据存储在 res.data 对象中。
                    // console.log(res.data);
                    that.isLogin = JSON.parse(res.data).isLogin;
                    that.user.uid = JSON.parse(res.data).uid;
                    if(that.isLogin) {
                        that.getUserMessage(that.user.uid);
                    } 
                },
                fail: function() {
                    uni.showToast({
                        title : '用户尚未登录',
                        icon : 'loading',
                        duration: 5000,
                        success: function(){
                            uni.switchTab({
                                url: '/pages/index/index'
                            });
                        }
                    });
                }
            });
		},
        methods: {
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
                             that.user = res.data[0];
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
            updateUser: function(event) {
                // 这是表单 submit 事件的处理函数
                const formdata = event.detail.value;
                if (formdata.password !== formdata.repassword) {
                    // 提示用户确认密码
                    uni.showToast({
                        title: '请确认你的密码',
                        icon: 'error'
                    });
                    return false;
                }
                const userData =  {
                    uid: this.user.uid,
                    user: formdata.userName,
                    passwd: md5(formdata.password)
                };
                uni.request({
                    method : 'POST',
                    url : 'http://localhost:3000/users/'+userData.uid,
                    header: { // 为正确提交表单数据，这项头信息设置必不可少
                        'content-type': 'application/x-www-form-urlencoded'
                    },
                    data : userData,
                    success : function(res) {
                        if (res.statusCode === 200) {
                            uni.showToast({
                                title: '用户信息已保存',
                                icon: 'success',
                                complete: function(){
                                    const pages = getCurrentPages();
                                    pages[pages.length - 1].onShow();
                                }
                            });
                        } else if(res.statusCode === 403) {
                            uni.showToast({
                                title: '该用户名已被占用',
                                icon: 'error',
                            });
                        } else if(res.statusCode === 400) {
                            uni.showToast({
                                title: '用户信息更新失败',
                                icon: 'error',
                            });
                        } else if(res.statusCode === 500) {
                            uni.showToast({
                                title: '数据库错误',
                                icon: 'error',
                            }); 
                        }
                    },
                    fail :  function(err) {
                        console.log(err);
                        uni.showToast({
                            title: '服务器不响应',
                            icon: 'error'
                        })
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

	.textArea {
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
</style>