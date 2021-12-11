<template>
    <div id="userMessage" class="box">
        <h3> 欢迎回来，{{ userName }} </h3>
        <div class="operation">
            <h4> 可执行的操作： </h4>
            <div class="edit" v-show="isUpdate">
                <table>
                    <tr>
                        <td>用户名：</td>
                        <td><input type="text" v-model="userName"></td>
                    </tr>
                    <tr>
                        <td>设置密码：</td>
                        <td><input type="password" v-model="password"></td>
                    </tr>
                    <tr>
                        <td>重复密码：</td>
                        <td><input type="password" v-model="rePassword"></td>
                    </tr>
                    <tr>
                        <td><input type="button" value="提交" @click="update"></td>
                        <td><input type="button" value="重置" @click="reset"></td>
                    </tr>
                </table>
            </div>
            <ul>
                <li><a href="javascript:void(0)" @click="isUpdate=!isUpdate">
                    {{ isUpdate? '取消编辑': '编辑信息' }}
                </a></li>
                <li><router-link to="/addBook">添加书籍</router-link></li>
                <li><a href="javascript:void(0)" @click="logout">退出登录</a></li>
            </ul>
        </div>
    </div>
</template>

<script>
import md5 from 'blueimp-md5';
import axios from 'axios';
import Qs from 'qs' ;

axios.defaults.withCredentials = true;

export default {
    name: 'userMessage',
    data: function() {
        return {
            isUpdate: false,
            userName: '',
            password: '',
            rePassword: ''
        }
    },
    created: function() {
        const that = this;
        axios.get('/users/'+this.$store.getters.getUID)
        .then(function(res) {
            if(res.statusText === 'OK' && 
                res.data.length == 1) {
                that.userName = res.data[0].userName;
            }
        })
        .catch(function(error) {
            if(error.message.indexOf('401') !== -1) {
                window.alert('你没有权限查看该用户！');
            } else if(error.message.indexOf('404') !== -1) {
                window.alert('用户不存在！');
            } else if(error.message.indexOf('500') !== -1) {
                window.alert('服务器故障，请稍后再试！');
            }
        })
    },
    methods: {
        update: function() {
            if(this.userName !== '' &&
                this.password !== '' &&
                this.rePassword !== '') {
                if(this.password === this.rePassword) {
                    const newMessage = {
                        uid: this.$store.getters.getUID,
                        user: this.userName,
                        passwd: md5(this.password)
                    }
                    const that = this;
                    axios.post('/users/'+newMessage.uid, Qs.stringify(newMessage))
                    .then(function(res) {
                        console.log(res.statusText)
                        if(res.statusText === 'OK') {
                            window.alert('信息修改成功！');
                            that.isUpdate = false;
                        }
                    })
                    .catch(function(error) {
                        if(error.message.indexOf('403') !== -1) {
                            window.alert('用户名已被占用！');
                        } else if(error.message.indexOf('400') !== -1) {
                            window.alert('你没有修改权限！');
                        } else if(error.message.indexOf('500') !== -1) {
                            window.alert('服务器故障，请稍后再试！');
                        }
                    });
                } else {
                    window.alert('你两次输入的密码不一致！');
                }
            } else {
                window.alert('请正确填写注册信息！');
            }

        },
        logout: function() {
            this.$emit('logout');
        },
        reset: function() {
            this.userName = '';
            this.password = '';
            this.rePassword = '';
        }
    }
}
</script>

<style>
    .box {
        width: 95%;
    }
    .box h3 {
        padding: 6px 10px;
        border-top-left-radius: 3px;
        border-top-right-radius: 14px;
        border: 1px solid #42b983;
        background: #f0f0f0;
        margin: 0px;
    }
    .box .operation {
        border: 1px solid #42b983;
        padding: 5px;        
    }
</style>