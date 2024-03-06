<template>
    <li class="nav-item">
        <a class="nav-link" data-bs-toggle="collapse" :href="`#collapse${ playerName }`" role="button" aria-expanded="false" :aria-controls="`collapse${ playerName }`">
            <i :class="`bi bi-${ iconClass }`"></i> {{ playerName }}
        </a>
    </li>
</template>
<script>
export default {
    name: 'SidebarLink',
    props: {
        'playerName': {
            type: String,
            required: true,
            default: ''
        },
        'iconClass': {
            type: String,
            required: true,
            default: ''
        }
    }
}
</script>
<style>
</style>