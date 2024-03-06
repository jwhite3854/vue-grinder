<template>
<div>
    <div class="sidebar offcanvas offcanvas-start" data-bs-scroll="true" id="offcanvasExample">
        <SidebarWrapper />
    </div>
    <div class="sidebar sidebar-collapse">
        <SidebarWrapper />
    </div>
</div>
</template>
<script>
import SidebarWrapper from '../components/SidebarWrapper.vue'

export default {
    name: "AppSidebar",
    components: {
        SidebarWrapper,
    }
}
</script>
<style>
</style>