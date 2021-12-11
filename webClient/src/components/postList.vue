<template>
    <div id="postList">
        <h2>书籍评论 （共 {{ posts.length }} 条)</h2>
        <table class="posts">
            <tr v-for="post in posts" :key="post.pid">
                <label for="postTitle">{{ post.postTitle }}</label>
                <div class="postContent">
                    {{ post.postContent }}
                    <div class="operation">
                        <input type="button" value="删除" @click="deletePost(post.pid)" />
                    </div>
                </div>
            </tr>
        </table>
        <div class="newpost" v-if="this.$store.getters.isLogin">
            <h2>提交新评论：</h2>
            <table>
                <tr>
                    <td>书评标题：</td>
                    <td>
                        <input type="text" v-model="newPostTitle" />
                    </td>                    
                </tr>
                <tr>
                    <td>笔记内容：</td>
                    <td>
                        <textarea rows="10" v-model="newPostText" />
                    </td>
                </tr>
                <tr>
                    <td><input type="button" value="保存" @click="addPost"></td>
                    <td><input type="button" value="重置" @click="reset"></td>
                </tr>
            </table>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
import Qs from 'qs';

axios.defaults.withCredentials = true;

export default {
    name: "postList",
    props:['bookid'],
    data: function() {
        return {
            posts: [],
            newPostTitle:'',
            newPostText:'',
            uid:''
        };
    },
    created: function() {
        this.uid = this.$store.getters.getUID;
        this.getPosts();
    },
    methods: {
        getPosts: function() {
            const that = this;
            axios.get('/posts/booklist/'+this.bookid)
            .then(function(res) {
                if(res.statusText === 'OK') {
                    that.posts = res.data;
                }
            })
            .catch(function(error){
                if(error.message.indexOf('400') !== -1) {
                   window.alert('相关书籍下面尚无书评！');
                } else if(error.message.indexOf('500') !== -1) {
                   window.alert('服务器故障，请稍后再试！');
                } 
            });
        },
        addPost: function() {
            if(this.newPostTitle === '' || this.newPostText === '') {
                window.alert('书评标题和内容都不能为空！');
                return false;
            }
            const that = this;
            const newpost = {
                postTitle: that.newPostTitle,
                postContent: that.newPostText,
                postDate: (new Date()).toString(),
                uid: that.uid,
                bid: that.bookid
            };
            axios.post('/posts/newpost', Qs.stringify(newpost))
            .then(function(res) {
                if(res.statusText === 'OK') {
                    that.getPosts();
                }
            })
            .catch(function(error) {
                if(error.message.indexOf('401') !== -1) {
                   window.alert('用户无评论权限！');
                } else if(error.message.indexOf('400') !== -1) {
                   window.alert('书评发布失败！');
                } else if(error.message.indexOf('500') !== -1) {
                   window.alert('服务器故障，请稍后再试！');
                } 
            });
            that.reset();
        },
        deletePost: function(id) {
            const that = this
            axios.delete('/posts/'+id)
            .then(function(res) {
                if(res.statusText === 'OK') {
                    that.getPosts();
                }
            })
            .catch(function(error) {
                if(error.message.indexOf('401') !== -1) {
                   window.alert('用户无评论权限！');
                } else if(error.message.indexOf('400') !== -1) {
                   window.alert('指定书评不存在！');
                } else if(error.message.indexOf('404') !== -1) {
                   window.alert('请先登录再执行删除！');
                } else if(error.message.indexOf('500') !== -1) {
                   window.alert('服务器故障，请稍后再试！');
                } 
            });
        },
        reset: function() {
            this.newNoteTitle = '';
            this.newNoteText = '';
        }
    }
};
</script>

<style scoped>
    .inputText {
        width: 650px;
    }

    .notes {
        width: auto;
    }
</style>