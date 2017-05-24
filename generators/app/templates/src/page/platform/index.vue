<template>
  <div>
    <plathead-component></plathead-component>
    <platitem-component></platitem-component>
  </div>
</template>

<script>
import PlatitemComponent from '../../components/platitem.vue';
import PlatheadComponent from '../../components/plathead.vue';
export default {
  name: 'Platform',
 
  components: {
        PlatitemComponent,
        PlatheadComponent
  }
}
</script>

<style lang="less">
</style>
