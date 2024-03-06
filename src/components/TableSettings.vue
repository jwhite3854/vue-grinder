<template>
    <div class="row collapse" id="collapseTableSettings">
        <div class="col-12">
            <div class="card">
                <div class="card-header">
                    <h4 class="card-title"><i class="bi bi-sliders"></i> Table Settings</h4> 
                    <p class="card-category">Last Campaign Performance</p>
                </div> 
                <div class="card-body">
                    <label><input id="checkboxToggle" onclick="toggleCards()" class="uk-checkbox" type="checkbox"> Hide Cards</label>
                    <div class="uk-inline uk-margin-left">
                        <span class="uk-form-icon uk-icon">BB:</span>
                        <input id="bbInput" class="uk-input uk-form-width-small" type="text" placeholder="2" value="2">
                    </div>
                    <div class="uk-inline">
                        <span class="uk-form-icon uk-icon">SB:</span>
                        <input id="sbInput" class="uk-input uk-form-width-small" type="text" placeholder="1" value="1">
                    </div>
                </div>
            </div> 
        </div>
    </div>
</template>
<script>
export default {
    name: 'TableSettings'
}
</script>
<style>
</style>