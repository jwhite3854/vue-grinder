<template>
    <div class="col-4">
        <div class="card card-seat">
            <div class="card-body">
                <div :id="`seat${idx}`">
                    <div class="row gx-3">
                         <div class="col-md-auto">
                            <div class="icon-big text-center">
                                <i :class="`bi-person-circle plr-${playerName}`"></i>
                            </div>
                            <div class="text-center">
                                <i class="bi-record-fill text-white"></i>
                            </div>
                        </div> 
                        <div class="col-md-auto table-seat text-center">
                            <span class="cardset"></span>
                        </div>
                    </div>
                </div> 
            </div> 
        </div>
    </div>
</template>
<script>
export default {
    name: 'PlayerSeatCard',
    props: {
        'playerName': {
            type: String,
            required: true,
            default: ''
        },
        'idx': {
            type: String,
            required: true,
            default: ''
        }
    }
}
</script>
<style>
</style>