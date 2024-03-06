import Vue from "vue"

import App from "./App.vue";
import JWPokerGrinder from "../packages/jw-grinder/main"

import '../packages/jw-grinder/style.css'


/* ---------------------------------------------------
    Setup VueApp
----------------------------------------------------- */
new Vue({
    el: '#jwtgrinder',
    render: h => h(App)
})


console.log("Goodbye World!");


/* ---------------------------------------------------
    Setup JWPokerGrinder
----------------------------------------------------- */
var jwPokerGrinder = new JWPokerGrinder();