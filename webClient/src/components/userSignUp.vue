<template>
    <div id="tab-sign">
        <table>
            <tr>
                <td>请输入用户名：</td>
                <td><input type="text" v-model="userName"></td>
            </tr>
            <tr>
                <td>请设置密码：</td>
                <td><input type="password" v-model="password"></td>
            </tr>
            <tr>
                <td>请重复密码：</td>
                <td><input type="password" v-model="rePassword"></td>
            </tr>
            <tr>
                <td><input type="button" value="注册" @click="signUp"></td>
                <td><input type="button" value="重置" @click="reset"></td>
            </tr>
        </table>
    </div>
</template>
<script>
import md5 from 'blueimp-md5';
import axios from 'axios';
import Qs from 'qs' ;

export default {
    name: "tab-sign",
    data() {
        return {
            userName: '',
            password: '',
            rePassword: ''
        };
    },
    methods: {
        signUp: function() {
            if(this.userName !== '' &&
                this.password !== '' &&
                this.rePassword !== '') {
                if(this.password === this.rePassword) {
                    const newUser = {
                        user: this.userName,
                        passwd: md5(this.password)
                    }
                    const that = this;
                    axios.post('/users/newuser', Qs.stringify(newUser))
                    .then(function(res) {
                        if(res.statusText === 'OK') {
                            window.alert('用户注册成功！');
                            that.$emit('goLogin');
                        }
                    })
                    .catch(function(error) {
                        if(error.message.indexOf('403') !== -1) {
                            window.alert('用户名已被占用！');
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
        reset: function() {
            this.userName = '';
            this.password = '';
            this.rePassword = '';
        }
    }
};
</script>
