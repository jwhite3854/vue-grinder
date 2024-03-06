<template>
    <div class="sidebar-wrapper">
        <div class="logo">
            <a href="#" class="simple-text">
                <div class="logo-img">jW</div>
                PokerTable
            </a>
        </div>
        <ul class="nav"> 
            <li class="nav-item">
                <a href="#" class="nav-link" role="button" aria-expanded="false" onclick="collapseAllSettings()">
                    <i class="bi bi-bank"></i> 
                    <p>Table</p>
                </a>
            </li> 
            <SidebarLink playerName="Results" iconClass="graph-up" />
            <SidebarLink iconClass="person-circle"
                v-for="( player ) of players"
                    :key="player"
                    :playerName="player" 
            />
        </ul>
    </div>
</template>
<script>
import SidebarLink from './SidebarLink.vue'

export default {
    name: 'SidebarWrapper',
    components: {
        SidebarLink,
    },
    data() {
        return {
            players: [
                "Andy", "Brad", "Chad", "Dave", "Eric", "Fred"
            ]
        }
    },
}
</script>
<style>
</style>