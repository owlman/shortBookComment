<template>
    <view class="content">
        <form class="form" @submit="pubPost">
            <view class="inputWrapper">
                <input name="postTitle" placeholder="请输入标题" />
            </view>
            <view class="inputWrapper">
                <textarea name="postContent" placeholder="请输入内容"></textarea>
            </view>
            <view class="formBtn">
                <button class="submit" form-type="submit">发布</button>
                <button class="reset" form-type="reset">重置</button>
            </view>
        </form>
    </view>
</template>

<script>
    export default {
        data: function() {
            return {
                userid: '',
                bookid: ''
            }
        },
        onLoad: function(option) {
            const that = this;
            uni.getStorage({
                key: 'user',
                success: function (res) {
                    // 获取到的数据存储在 res.data 对象中。
                    // console.log(res.data);
                    const user = JSON.parse(res.data);
                    if(user.isLogin) {
                        that.userid = user.uid;
                        that.bookid = option.bookid;
                    }
                }
            });

        },
        methods: {
            pubPost: function(event) {
                // 这是表单 submit 事件的处理函数
                const formdata = event.detail.value;
                const postData =  {
                    uid: this.userid,
                    bid: this.bookid,
                    postTitle : formdata.postTitle,
                    postContent: formdata.postContent,
                    postDate: new Date()
                };
                const that = this;
                uni.request({
                    method  : 'POST',
                    url  : 'http://localhost:3000/posts/newpost',
                    header : {    // 为正确提交表单数据，这项头信息设置必不可少
                        'content-type': 'application/x-www-form-urlencoded'
                    },
                    data :  postData,
                    success :  function(res) {
                        // 返回的响应数据存储在 res.data 对象中
                        // console.log(res.data);
                        const pages= getCurrentPages();
                        const prevPage = pages[pages.length -2];
                        if(res.statusCode === 200) {
                            uni.navigateBack({
                                success: function(){
                                    const option = {
                                        bookid: that.bookid
                                    };
                                    prevPage.onLoad(option);
                                }
                            });
                        }  else if(res.statusCode === 400) {
                            uni.showToast({
                                    title : '请输入书评的标题和内容',
                                    icon : 'error'
                            });
                        }  else if(res.statusCode === 401) {
                            uni.showToast({
                                title : '请确认用户权限',
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
    .form{
		padding: 0 200rpx;
		margin-top: 40rpx;
	}

    .inputWrapper {
		width: 100%;
		border-radius: 20rpx;
        border-style: groove;
		box-sizing: border-box;
		padding: 0 20rpx;
		margin-top: 25rpx;
	}
	
    .inputWrapper input{
		width: 100%;
		height: 80rpx;
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