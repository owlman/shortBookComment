<template>
    <div id="booklist">
        <table class="list">
            <tr>
                <th>书籍</th>
                <th>作者</th>
                <th>出版社</th>
                <th>出版日期</th>
                <th>操作</th>
            </tr>
            <tr v-for="book in books" :key="book.bid">
                <td>
                    <img :src="book.bookFace" :alt="book.bookName"></td>
                <td>
                    {{ book.authors }}
                </td>
                <td>
                    {{ book.publishingHouse }}
                </td>
                <td>
                    {{ (new Date(book.publishDate)).toLocaleDateString() }}
                </td>
                <td>
                    <ul>
                        <li><router-link :to="'/bookComment/'+book.bid">
                            查看书评
                        </router-link></li>
                        <li><router-link :to="'/editBook/'+book.bid">
                            修改书籍
                        </router-link></li>
                        <li><a href="javascript:void(0)" @click="deleteBook(book.bid)">
                            删除书籍
                        </a></li>
                    </ul>
                </td>
            </tr>
        </table>
    </div>
</template>
<script>
import axios from 'axios'

axios.defaults.withCredentials = true;

export default {
    name: 'booklist',
    data: function() {
        return {
            books: []
        };
    },
    created: function() {
        this.getBooks();
    },
    methods: {
        deleteBook: function(bid) {
            const that = this;
            axios.delete('/books/'+bid)
            .then(function(res) {
                if(res.statusText === 'OK') {
                    that.getBooks();
                }
            })
            .catch(function(error) {
                if(error.message.indexOf('401') !== -1) {
                    window.alert('你没有删除权限！');
                } else if(error.message.indexOf('400') !== -1) {
                    window.alert('书籍删除错误！');
                } else if(error.message.indexOf('500') !== -1) {
                    window.alert('服务器故障，请稍后再试！');
                }
            });
        },
        getBooks: function() {
            const that = this;
            axios.get('/books/list/')
            .then(function(res) {
                if(res.statusText === 'OK') {
                    that.books = res.data;
                }
            })
            .catch(function(error) {
                if(error.message.indexOf('500') !== -1) {
                    window.alert('服务器故障，请稍后再试！');
                }
            })
        }
    }
}
</script>
<style>
    .list {
        width: 700px;
        border: 1px solid #42b983;
    }
    .list th {
        background: #f0f0f0;
    }
    .list img {
        margin: 5px;
        width: 100px;
    }
</style>