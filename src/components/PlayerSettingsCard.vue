<template>
    <div class="col-md-4 col-xs-6 collapse" :id="`collapse${ playerName }`">
        <div class="card">
            <div :class="`card-header plr-bg-${ lowerName } pb-3`">
                <h4 class="card-title text-white"><i class="bi bi-sliders"></i> {{ playerName }} Settings</h4> 
            </div> 
            <div class="card-body">
                <fieldset class="player-settings">
                    <div class="mb-1">
                        <label class="form-label">Risk Acceptance</label>
                        <input type="range" :name="`ps[${ playerName }][rac]`" class="form-range" value="3" min="1" max="5" step="1">
                    </div>
                    <div class="mb-1">
                        <label class="form-label">Aggression</label>
                        <input type="range" :name="`ps[${ playerName }][agg]`" class="form-range" value="3" min="1" max="5" step="1">
                    </div>
                    <div class="mb-1">
                        <label class="form-label">Patience</label>
                        <input type="range" :name="`ps[${ playerName }][pat]`" class="form-range" value="3" min="1" max="5" step="1">
                    </div>
                    <div class="mb-1">
                        <label class="form-label">Pettiness</label>
                        <input type="range" :name="`ps[${ playerName }][pet]`" class="form-range" value="3" min="1" max="5" step="1">
                    </div>
                </fieldset>
            </div> 
        </div>
    </div>
</template>
<script>
export default {
    name: 'PlayerSettingsCard',
    props: {
        'playerName': {
            type: String,
            required: true,
            default: ''
        }
    },
    computed: {
        'lowerName': function() {
            return this.playerName.toLowerCase()
        }
    }
}
</script>
<style>
</style>