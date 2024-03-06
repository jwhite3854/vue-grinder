<template>
    <div class="col-xl-2 col-md-2 col-sm-6">
        <div class="card card-stats">
            <div class="card-body">
                <div class="row">
                    <div class="col-xl-5 col-md-12">
                        <div class="icon-big text-center">
                            <i :class="`bi-person-circle plr-${ lowerName }`"></i>
                        </div>
                    </div> 
                    <div class="col-xl-7 col-md-12">
                        <div class="numbers">
                            <p class="card-category">Stack</p> 
                            <h5 :id="`stack${idN}`" class="card-title"></h5>
                        </div>
                    </div>
                </div> 
            </div> 
        </div>
    </div>
</template>
<script>
export default {
    name: 'PlayerSummaryCard',
    props: {
        'playerName': {
            type: String,
            required: true,
            default: ''
        },
        'idx': {
            type: Number,
            required: true,
            default: 1
        }
    },
    computed: {
        'lowerName': function() {
            return this.playerName.toLowerCase()
        },
        'idN': function() {
            return this.idx+1
        }
    }
}
</script>
<style>
</style>