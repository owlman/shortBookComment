<template>
    <view class="content">
         <view class="book-list">
            <view class="book" v-for="book in books" :key="book.bid">
                <view class="image-view">
                    <image class="book-image" :src="book.bookFace"></image>
                </view>
                <view class="book-title">
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
        onLoad: function() {
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
    .book-list {
        display: block;
        width: 100%;
    }
    .book {
		margin: 2%;
        display: block;
        float: left;
        width: 45%;
    }
    .book-image {
        display: block;
        width: 95%;
    }
    .book-title  {
		margin: 2%;
    }

</style>