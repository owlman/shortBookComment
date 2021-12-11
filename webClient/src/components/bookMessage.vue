<template>
    <div id="bookMessage">
        <div class="face">
            <img :src="bookFace" alt="封面图">
        </div>
        <table class="message">
            <tr>
                <td>书名：</td>
                <td> {{ bookName }} </td>
            </tr>
            <tr>
                <td>作者：</td>
                <td> {{ authors }} </td>
            </tr>
            <tr>
                <td>出版社：</td>
                <td> {{ publishingHouse }} </td>
            </tr>
            <tr>
                <td>出版日期：</td>
                <td> {{ publishDate }} </td>
            </tr>
        </table>
    </div>
</template>

<script>
import axios from 'axios';

axios.defaults.withCredentials = true;

export default {
    name: 'bookMessage',
    props: ['bookid'],
    data: function() {
        return {
            bookName: '',
            bookFace: '',
            authors: '',
            publishingHouse: '',
            publishDate: new Date()
        };
    },
    created: function() {
        const that = this;
        axios.get('/books/'+this.bookid)
        .then(function(res) {
            if(res.statusText === 'OK' &&
                res.data.length == 1) {
                that.bookFace = res.data[0].bookFace;
                that.bookName = res.data[0].bookName;
                that.authors = res.data[0].authors;
                that.publishingHouse = res.data[0].publishingHouse;
                that.publishDate 
                    = res.data[0].publishDate.toLocaleDateString();
            }                
        })
        .catch(function(error) {
            if(error.message.indexOf('404') !== -1) {
                window.alert('被查询的书籍不存在！');
            } else if(error.message.indexOf('500') !== -1) {
                window.alert('服务器故障，请稍后再试！');
            } 
        });
    }
}
</script>
<style scoped>
    .face {
        float: left;
        width: 120px;
        margin: 10px;
    }
    .face img {
        width: 90%;
        display: block;
    }
    .message {
        font-size: 24px;
        text-align: left;
    }
</style>