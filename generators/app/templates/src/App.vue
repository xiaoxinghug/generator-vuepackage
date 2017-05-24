<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style lang="less">
@import "./less/reset.less";
img {
   max-width:100%;
   display:block;
   border:none;
   margin:0 auto;
 }
</style>
