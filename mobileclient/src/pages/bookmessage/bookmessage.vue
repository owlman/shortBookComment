<template>
    <view class="content">
        <view class="book">
            <view class="imageView">
                <image class="bookImage" :src="bookFace"></image>
            </view>
            <view class="bookMessage">
                <text class="bookTitle">《{{ bookName }}》</text>
                <text>写作者：{{ authors }}</text>
                <text>出版社：{{ publishingHouse }}</text>
                <text>出版日：{{ publishDate.toLocaleDateString() }}</text>
                <navigator :url="'/pages/newpost/newpost?bookid='+bookid"> >>> 添加新书评</navigator>
            </view>
        </view>
        <view class="bookComment">
            <view class="listTitle">
               <text>已有书评：</text>
            </view>            
            <view class="commentList">
                <uni-list>
                    <uni-list-item v-for="post in posts" :key="post.pid"
                        :title="post.postTitle"
                        link="navigateTo"
                        :to="'/pages/post/post?pid='+post.pid"
                    />
                </uni-list>
            </view>            
        </view>
    </view>
</template>
<script>
    import { uniList, uniListItem } from '@dcloudio/uni-ui';

    export default {
        components: { uniList, uniListItem },
        data: function() {
            return {
                posts: [],
                bookid: '',
                bookName: '',
                bookFace: '',
                authors: '',
                publishingHouse: '',
                publishDate: new Date()
            };
        },
        onLoad: function(option) {
            // 外部传递的参数存储在 option 对象中
            // 可通过 option.[参数名] 的方式来访问
            const that = this;
            that.bookid = option.bookid;
            uni.request({
                method : 'GET',
                url : 'http://localhost:3000/books/'+option.bookid,
                success : function(res) {
                    if(res.statusCode === 200 &&
                           res.data.length == 1) {
                        that.bookFace = res.data[0].bookFace;
                        that.bookName = res.data[0].bookName;
                        that.authors = res.data[0].authors;
                        that.publishingHouse = res.data[0].publishingHouse;
                        that.publishDate = res.data[0].publishDate;
                        that.getPosts(option.bookid);
                    } else if(res.statusCode === 500)  {
                        uni.showToast({
                            title : '数据库错误信息',
                            icon : 'error'
                        });
                    } else if(res.statusCode === 404)  {
                        uni.showToast({
                            title : '被查询的书籍不存在',
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
        methods: {
            getPosts: function(bookid) {
                const that = this;
                uni.request({
                    method : 'GET',
                    url : 'http://localhost:3000/posts/booklist/'+bookid,
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
                                title : '当前书籍还没有人评论',
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
        justify-content: flex-start; 
    }

    .book {
        display: flex ;
		flex-direction: row;
        align-content: flex-start;
		margin: 5%;
	}

    .bookComment {
		margin: 5%;
    }

    .bookImage {
		width: 250rpx;
        height: 320rpx;
		margin: 5%;
    }

    .bookMessage {
        display: flex;
        flex-direction: column;
        align-content: space-between;
        flex-wrap: wrap;
		margin: 5%;
    }

    .bookMessage navigator {
        margin-top: 30rpx;
    }
   
    .bookTitle {
        font-size: 38rpx;
        margin-bottom: 50rpx;
    }
</style>
