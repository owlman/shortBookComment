<template>
    <view class="content">
        <view class="editor" v-if="isEdit">
            <form class="form" @submit="editPost">
                <view class="inputWrapper">
                    <input name="postTitle" v-model="post.postTitle" />
                </view>
                <view class="inputWrapper">
                    <textarea name="postContent" v-model="post.postContent"></textarea>
                </view>
                <view class="formBtn">
                    <button class="submit" form-type="submit">保存</button>
                    <button class="reset" form-type="reset">重置</button>
                </view>
            </form>
        </view>
        <view class="reader" v-if="!isEdit">
            <view class="text-area">
                <text class="title"> {{ post.postTitle }} </text>
                <text class="post"> {{ post.postContent }} </text>
            </view>
            <view class="formBtn">
                <button class="submit" @click="isEdit=true">修改</button>
                <button class="delete" @click="deletePost">删除</button>
            </view>
        </view>
    </view>
</template>
<script>
    export default {
        data() {
            return {
                isEdit: false,
                post: {}
            }
        },
        methods: {
            onLoad: function(option) {
                const that = this;
                uni.request({
                    method : 'GET',
                    url : 'http://localhost:3000/posts/'+option.pid,
                    success : function(res) {
                        if(res.statusCode === 200 &&
                            res.data.length == 1) {
                           that.post = res.data[0];
                           
                        } else if(res.statusCode === 500)  {
                            uni.showToast({
                                title : '数据库错误信息',
                                icon : 'error'
                            });
                        } else if(res.statusCode === 404)  {
                            uni.showToast({
                                title : '被查询的帖子不存在',
                                icon : 'error'
                            });
                        }
                    },
                    fail : function(err) {
                        uni.showToast({
                            title : '服务器不响应',
                            icon : 'error'
                        });
                    }
                });
            },
            editPost: function(event) {
                // 这是表单 submit 事件的处理函数
                const that = this;
                uni.request({
                    method  : 'POST',
                    url  : 'http://localhost:3000/posts/'+that.post.pid,
                    header : {    // 为正确提交表单数据，这项头信息设置必不可少
                        'content-type': 'application/x-www-form-urlencoded'
                    },
                    data :  that.post,
                    success :  function(res) {
                        // 返回的响应数据存储在 res.data 对象中
                        // console.log(res.data);
                        const pages= getCurrentPages();
                        const prevPage = pages[pages.length -2];
                        if(res.statusCode === 200) {
                            uni.navigateBack({
                                success: function(){
                                    const option = {
                                        bookid: that.post.bid
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
                            title : '服务端不响应',
                            icon : 'error'
                        });
                    }
                });
            },
            deletePost: function() {
                const that = this;
                uni.request({
                    method  : 'DELETE',
                    url  : 'http://localhost:3000/posts/'+that.post.pid,
                    success :  function(res) {
                        // 返回的响应数据存储在 res.data 对象中
                        // console.log(res.data);
                        const pages= getCurrentPages();
                        const prevPage = pages[pages.length -2];
                        if(res.statusCode === 200) {
                            uni.navigateBack({
                                success: function(){
                                    const option = {
                                        bookid: that.post.bid
                                    };
                                    prevPage.onLoad(option);
                                }
                            });
                        }  else if(res.statusCode === 404) {
                            uni.showToast({
                                    title : '要删除的帖子不存在',
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
                            title : '服务端不响应',
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

	.text-area {
		padding: 30rpx 100rpx;		
		display: flex;
        flex-direction: column;
	}

	.title {
        padding: 15rpx 30rpx;
		border-radius: 25rpx;
        border-style: groove;
		box-sizing: border-box;
		font-size: 40rpx;
		color: gray;
    }

    .post{
        margin: 5%;
		padding: 15rpx 20rpx;
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

    .delete {
		width: 45%;
		border-radius: 25rpx;
        color:white;
        background-color: red;
    }
</style>
