<template>
    <div id="tabLogin">
        <table>
            <tr>
                <td>用户名：</td>
                <td><input type="text" v-model="userName"></td>
            </tr>
            <tr>
                <td>密  码：</td>
                <td><input type="password" v-model="password"></td>
            </tr>
            <tr>
                <td><input type="button" value="登录" @click="login"></td>
                <td><input type="button" value="重置" @click="reset"></td>
            </tr>
        </table>
    </div>
</template>

<script>
import md5 from 'blueimp-md5';
import axios from 'axios';
import Qs from 'qs' ;

axios.defaults.withCredentials = true;

export default {
    name: "tabLogin",
    data: function() {
        return {
            userName: '',
            password: ''
        };
    },
    methods: {
        login: function() {
            if(this.userName !== '' && this.password !== '') {
                const userData =  {
                    user: this.userName,
                    passwd: md5(this.password)
                }
                const that = this;
                axios.post(`/users/session`, Qs.stringify(userData))
                .then(function(res) {
                    if(res.statusText === 'OK' && 
                        res.data.length == 1) {
                        const user = {
                            isLogin: true,
                            uid: res.data[0].uid
                        }; 
                        that.$emit('login', user);
                    } 
                })
                .catch(function(error) {
                    if(error.message.indexOf('401') !== -1) {
                        window.alert('用户名或密码错误！');
                    }
                })
            } else {
                window.alert('用户名与密码都不能为空！');

            }
        },
        reset: function() {
            this.userName = '';
            this.password = '';
        }
    }
};
</script>
