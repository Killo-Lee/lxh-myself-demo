<template>
  <div id="app">
<!--    <div id="nav">-->
<!--      <router-link to="/">Home</router-link> |-->
<!--      <router-link to="/about">About</router-link>-->
<!--    </div>-->
      <router-view></router-view>
  </div>
</template>
<script>
    export default {
        name: 'App',
        mounted(){
            window.addEventListener('unload',this.saveState)
        },
        methods:{
            saveState(){
                sessionStorage.setItem('state',JSON.stringify(this.$store.state.user))
            }
        }
    }
</script>
<style>
    *{
        margin: 0;
        padding: 0;
        border: none;
    }
    #app{
        width: 100%;
    }
    ::-webkit-scrollbar
    {
        width: 8px;
        height: 8px;
    }
    ::-webkit-scrollbar-track
    {
        border-radius: 8px;
        background-color: rgba(0, 0, 2, 0.06);
    }
    ::-webkit-scrollbar-thumb
    {
        border-radius: 8px;
        -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.16);
        background-color: rgba(0, 0, 0, 0.09);
    }
</style>
