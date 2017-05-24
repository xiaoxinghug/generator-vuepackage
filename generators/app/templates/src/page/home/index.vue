<template>
  <div>
    <header-component></header-component>
    <homeitem-component></homeitem-component>
  </div>
</template>

<script>
import HeaderComponent from '../../components/header.vue';
import HomeitemComponent from '../../components/homeitem.vue';
export default {
  name: 'home',
  components: {
        HeaderComponent,
        HomeitemComponent
  }
}
</script>

<style lang="less">
</style>
