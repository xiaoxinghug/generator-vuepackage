<template>
    <div class="fix-tips" v-show="loadingFn && loadingFn.length>0">
      <div class="tips-div" v-html="loadingFn">

      </div>
    </div>
</template>

<script>
export default {
  name: 'Tip',
  data () {
    return {
       loadingText:""
    }
  },
  props: ['config'],
  mounted() {

  },
  computed:{
    loadingFn(){
      return this.loadingText = this.config.loadingText;
    }
  },
  created(){

  },
  methods:{
    
  },
  components: {

  }
}
</script>

<style lang="less">
  .fix-tips {
      position: fixed;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      background: transparent;
      .tips-div {
          background: rgba(0,0,0,.7);
          padding: .05rem;
          position: absolute;
          top: 50%;
          left: 50%;
          -webkit-transform: translate(-50%, -50%);
          transform: translate(-50%, -50%);
          border-radius: 0.04rem;
          color: #f1d28d;
      }
  }
</style>
