<template>
    <div id="editBook">
        <book-form 
            :bookid="this.$route.params.bid" 
            @success="success">
        </book-form>
    </div>
</template>
<script>
import bookForm from '@/components/bookForm.vue';

export default {
    name: 'editBook',
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
