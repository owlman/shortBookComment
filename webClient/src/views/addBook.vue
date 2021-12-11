<template>
    <div id="addBook">
        <book-form bookid="newBook" @success="success"></book-form>
    </div>
</template>
<script>
import bookForm from '@/components/bookForm.vue';

export default {
    name: 'addBook',
    components: {
        'book-form': bookForm
    },
    methods: {
        success: function() {
            this.$router.push({ name: 'Home' });
            this.$router.go(0);
        }
    }
}
</script>
