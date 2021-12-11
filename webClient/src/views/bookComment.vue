<template>
    <div id="bookComment">
        <div class="bookMessage">
            <book-message :bookid="this.$route.params.bid"></book-message>
        </div>
        <div class="postList">
            <post-list :bookid="this.$route.params.bid"></post-list>
        </div>
    </div>
</template>
<script>
import bookMessage from '@/components/bookMessage.vue';
import postList from '@/components/postList.vue';

export default {
    name: 'bookComment',
    components: {
        'book-message': bookMessage,
        'post-list': postList
    }
}
</script>
<style scoped>
.bookMessage {
    clear: both;
}
.postList {
    clear: both;
}
</style>