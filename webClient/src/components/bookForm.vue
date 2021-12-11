<template>
    <div id="bookform">
        <div class="face">
            <img :src="bookFace" alt="封面图">
            <input value="上传封面" type="file" @change="uploadImage($event)">
        </div>
        <table class="message">
            <tr>
                <td>新书名称：</td>
                <td><input type="text" v-model="bookName"></td>
            </tr>
            <tr>
                <td>作者：</td>
                <td><input type="text" v-model="authors"></td>
            </tr>
            <tr>
                <td>出版社：</td>
                <td><input type="text" v-model="publishingHouse"></td>
            </tr>
            <tr>
                <td>出版日期：</td>
                <td><input type="date" v-model="publishDate"></td>
            </tr>
            <tr>
                <td><input type="button" value="添加" @click="submitBook"></td>
                <td><input type="button" value="重置" @click="reset"></td>
            </tr>
        </table>
    </div>
</template>

<script>
import axios from 'axios';
import Qs from 'qs';

axios.defaults.withCredentials = true;

export default {
    name: 'bookform',
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
        console.log(this.bookid)
        if(this.bookid === 'newBook') {
            this.bookFace = require('../assets/default.png');
        } else {
            const that = this;
            axios.get('/books/'+this.bookid)
            .then(function(res) {
                if(res.statusText === 'OK' &&
                   res.data.length == 1) {
                   that.bookFace = res.data[0].bookFace;
                   that.bookName = res.data[0].bookName;
                   that.authors = res.data[0].authors;
                   that.publishingHouse = res.data[0].publishingHouse;
                   that.publishDate = res.data[0].publishDate;
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
    },
    methods: {
        uploadImage: function(e) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (e) => {
                // 读取到的图片base64 数据编码 将此编码字符串传给后台即可
                const imgcode = e.target.result;
                this.bookFace = imgcode
            }
        },
        submitBook: function() {
            const book = {
                bookName: this.bookName,
                bookFace: this.bookFace,
                authors: this.authors,
                publishingHouse: this.publishingHouse,
                publishDate: this.publishDate.toString()
            };
            const that = this;
            let url = '';
            if(this.bookid === 'newBook') {
                url = '/books/newbook';
            } else {
                url = '/books/'+that.bookid;
            }
            axios.post(url, Qs.stringify(book))
            .then(function(res) {
                if(res.statusText === 'OK') {
                   window.alert('书籍信息上传成功！');
                   that.$emit('success');
                }
            })
            .catch(function(error) {
                if(error.message.indexOf('400') !== -1) {
                   window.alert('书籍信息上传失败！');
                } else if(error.message.indexOf('500') !== -1) {
                   window.alert('服务器故障，请稍后再试！');
                }
            })
        },
        reset: function() {
            this.bookName = '';
            this.authors = '';
            this.publishingHouse = '';
            this.publishDate = new Date();
            this.bookFace = require('../assets/default.png');
        }
    }
}
</script>

<style>
    .face {
        float: left;
        width: 150px;
        margin: 22px;
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