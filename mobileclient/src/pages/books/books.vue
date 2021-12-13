<template>
    <view class="content">
         <view class="bookList">
            <view class="book" v-for="book in books" :key="book.bid">
                <view class="imageView">
                    <image class="bookImage" :src="book.bookFace"></image>
                </view>
                <view class="bookTitle">
                    <navigator :url="'/pages/bookmessage/bookmessage?bookid='+book.bid">
                        《{{book.bookName}}》
                    </navigator>
                </view>
            </view>
        </view>
    </view>
</template>
<script>
    export default {
        data: function() {
            return {
                books: []
            };
        },

        onShow: function() {
            // 将获取书籍列表的操作封装
            // 以备将来重复调用
            this.getBooks();
        },

        methods: {
            getBooks: function() {
                const that = this;
                uni.request({
                    method : 'GET',
                    url : 'http://localhost:3000/books/list/',
                    success : function(res) {
                        if(res.statusCode === 200) {
                            that.books = res.data;
                        } else if(res.statusCode === 500)  {
                            uni.showToast({
                                title : '数据库错误信息',
                                icon : 'error'
                           });
                        }
                    },
                    fail :  function(err) {
                        uni.showToast({
                            title : '获取书籍列表失败',
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
		margin: 2%;
	}

    .bookList {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        flex-wrap: wrap;
    }

    .book {
        display: flex;
        flex-direction: column;
        align-content: flex-start;
		margin: 2%;;
    }

    .bookImage {
		width: 300rpx;
        height: 450rpx;
		margin: 4%;;
    }
    
    .bookTitle  {
		margin: 2%;
    }
</style>