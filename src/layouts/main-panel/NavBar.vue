<template>
    <nav class="navbar navbar-expand-lg">
        <div class="container-fluid">
            <button type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-expanded="false" aria-controls="offcanvasExample" class="navbar-toggler navbar-toggler-right toggled">
                <span class="navbar-toggler-bar burger-lines"></span> 
                <span class="navbar-toggler-bar burger-lines"></span> 
                <span class="navbar-toggler-bar burger-lines"></span>
            </button> 
            <ul class="nav navbar-nav mr-auto">
                <li class="nav-item">
                    <div class="input-group" style="width: 180px">
                        <button class="btn btn-primary" type="button" id="playButton"><i class="bi-play-fill"></i> Play</button>
                        <input type="text" name="playCount" class="form-control" value="1000">
                    </div>
                </li>
                <li class="nav-item">
                    <span class="badge rounded-pill pktbl-bg gameCt">0</span>
                </li>
            </ul>
            <div class="collapse navbar-collapse justify-content-end">
                <ul class="nav navbar-nav ml-auto">
                    <sidebar-link playerName="TableSettings" iconClass="gear" />
                    <li class="nav-item">
                        <a href="#" class="nav-link resetTable"><i class="bi bi-arrow-clockwise"></i> Reset</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>
<script>
import SidebarLink from '../../components/SidebarLink.vue'

export default {
    name: "AppSidebar",
    components: {
        "sidebar-link": SidebarLink,
    }
}
</script>
<style>
.navbar-toggle,.ui-slider-handle:focus,input:focus{outline:0!important}
.nav .nav-item .nav-link:focus,
.nav .nav-item .nav-link:hover {
    background-color: transparent;
}
.navbar {
    border: 0;
    font-size: 16px;
    border-radius: 0;
    min-height: 50px;
    background-color: hsla(0, 0%, 100%, 0.96);
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    padding: 5px 15px;
}
.navbar .navbar-brand {
    font-weight: 400;
    margin: 5px 0;
    font-size: 20px;
    color: #005b96;
}
.navbar .navbar-brand:hover {
    color: #03396c;
}
.navbar .navbar-toggler {
    width: 37px;
    height: 27px;
    vertical-align: middle;
    outline: 0;
    cursor: pointer;
}
.navbar .navbar-toggler.navbar-toggler-left {
    position: relative;
    left: 0;
    padding-left: 0;
}
.navbar .navbar-toggler .navbar-toggler-bar {
    width: 3px;
    height: 3px;
    border-radius: 50%;
    margin: 0 auto;
}
.navbar .navbar-toggler .burger-lines {
    display: block;
    position: relative;
    background-color: #005b96;
    width: 24px;
    height: 2px;
    border-radius: 1px;
    margin: 4px auto;
}
.navbar .dropdown.nav-item .dropdown-toggle:after {
    margin-top: 8px;
}
.navbar .navbar-nav {
    align-items: center;
}
.navbar .navbar-nav .nav-item .nav-link {
    color: #03396c;
    padding: 10px 15px;
    position: relative;
    display: inline-flex;
    line-height: 1.2;
}
.navbar .navbar-nav .nav-item .nav-link.btn {
    margin: 15px 3px;
    padding: 8px 16px;
}
.navbar .navbar-nav .nav-item .nav-link.btn-round {
    margin: 16px 3px;
}
.navbar .navbar-nav .nav-item .nav-link .bi {
    font-size: 19px;
    padding-right: 6px;
}
.navbar .navbar-nav .nav-item .nav-link:hover {
    color: #005b96;
}
.navbar .navbar-nav .nav-item .dropdown-menu {
    border-radius: 10px;
    margin-top: -5px;
}
.navbar .navbar-nav .nav-item .dropdown-menu .dropdown-item:first-child {
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
}
.navbar .navbar-nav .nav-item .dropdown-menu .dropdown-item:last-child {
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
}
.navbar .navbar-nav .nav-item .dropdown-menu .divider {
    height: 1px;
    margin: 5px 0;
    overflow: hidden;
    background-color: #e5e5e5;
}

.navbar .navbar-nav .dropdown-toggle:after {
    display: inline-block;
    width: 0;
    height: 0;
    margin-left: 5px;
    margin-top: 12px;
    vertical-align: middle;
    border-top: 4px dashed;
    border-top: 4px solid\9;
    border-right: 4px solid transparent;
    border-left: 4px solid transparent;
}
</style>