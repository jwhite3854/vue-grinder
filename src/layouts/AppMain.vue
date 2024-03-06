<template>
    <div class="main-panel">
        <app-navbar></app-navbar>
        <app-content></app-content>
        <app-footer></app-footer>
    </div>
</template>
<script>
import Navbar from './main-panel/NavBar.vue'
import Content from './main-panel/Content.vue'
import Footer from './main-panel/Footer.vue'

export default {
    name: "AppMain",
    components: {
        "app-navbar": Navbar,
        "app-content": Content,
        "app-footer": Footer
    },
    data: function() {
        return {
            
        }
    },
}
</script>
<style>
</style>