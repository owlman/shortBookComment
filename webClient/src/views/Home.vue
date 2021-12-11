<template>
    <div class="home">
        <div class="users" v-if="!this.$store.getters.isLogin">
            <input type="button" value="用户登录" 
                :class="['tab-button', { active: componentId === 'login' }]"
                @click="componentId='login'">
            
            <input type="button" value="注册新用户" 
                :class="['tab-button', { active: componentId === 'signup' }]"
                @click="componentId='signup'">
            <keep-alive>
                <component 
                    class="tab" 
                    :is="componentId" 
                    @login="login"
                    @goLogin="goLogin">
                </component>
            </keep-alive>
        </div>
        <div class="users" v-if="this.$store.getters.isLogin">
            <user-message @logout="logout"></user-message>
        </div>
        <div class="main">
            <book-list></book-list>
        </div>
    </div>
</template>
<script>
import userLogin from '@/components/userLogin.vue';
import userSignUp from '@/components/userSignUp.vue';
import userMessage from '@/components/userMessage.vue';
import bookList from '@/components/bookList.vue';

export default {
    name: 'Home',
    data: function() {
        return {
            componentId: 'login',
        };
    },
    methods: {
        goLogin: function() {
            this.componentId = 'login';
        },
        login: function(userData) {
            this.$cookies.set('uid', userData.uid);
            this.$cookies.set('isLogin', userData.isLogin);
            this.$store.commit('login', userData);
        },
        logout: function() {
            console.log('logout...');
            this.$cookies.remove('uid');
            this.$cookies.remove('isLogin');
            this.$store.commit('logout');
        }
    },
    components: {
        login: userLogin,
        signup : userSignUp,
        'user-message': userMessage,
        'book-list': bookList
    }
}
</script>
<style scoped>
    @import '../assets/styles/Home.css';
</style>
