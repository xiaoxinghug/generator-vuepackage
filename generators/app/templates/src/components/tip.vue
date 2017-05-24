<template>
    <div class="fix-tips" v-if="$store.state.tipInfor">
      <div class="tips-div" v-html="$store.state.tipInfor">

      </div>
    </div>
</template>

<script>
export default {
  name: 'Tip',
  data () {
    return {
        // tips : ""
        isTime : false
    }
  },
  props: ['config'],
  mounted() {
  },
  created(){
    // this.tips = this.$store.state.tipInfor;
    this.showTios();
  },
  methods:{
    setTips() {
        setTimeout(() => {
          this.$store.state.tipInfor = '';
          this.isTime = false;
        }, 1000)
      },
    showTios(){
      setInterval(()=>{
         if (this.$store.state.tipInfor != ""){
             if (!this.isTime){
                this.isTime = true;
                this.setTips(this.$store.state.tipInfor);
             }
         }else{
             return;
         }
      },50)
    }
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
