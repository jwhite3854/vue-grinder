<template>
    <div class="wrapper">
        <app-sidebar></app-sidebar>
        <app-main></app-main>
    </div>
</template>

<script>
import AppSidebar from './layouts/AppSidebar'
import AppMain from './layouts/AppMain'

export default {
    name: "App",
    components: {
        "app-sidebar": AppSidebar,
        "app-main": AppMain
    }
}
</script>
<style>
</style>