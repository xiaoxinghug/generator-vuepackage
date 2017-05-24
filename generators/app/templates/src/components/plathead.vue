<template>
  <div class="palt-head">
       <header>
          <strong>
           <router-link :to = "'/setinfor'">
            <span style="color:#979797;padding:0px 0.1rem 0px 0px;font-size:0.15rem;display:inline-block;">+</span>新建
           </router-link>
          </strong>
           <p>制作福利卡，分享给用户，提升店铺曝光吧</p>
       </header>
       <section>
             <h5>已经创建项目</h5>
       </section>
  </div>
</template>

<script>
export default {
  name: 'plathead',
  data () {
    return {

    }
  },
  created(){

  },
   components: {
      
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
 a{
   color:#979797;
 }
  @import "../less/util.less";
   .palt-head{
     height:1.49rem;
     background-color:#fff;
     padding-top:0.15rem;
     section{
       height:0.47rem;
       font-size:0.13rem;
       color:#999999;
       text-align:center;
       line-height:0.47rem;
       margin-top:0.38rem;
       background-color:#f5f5f5;
       h5{
         position:relative;
       }
       h5::before{
         border-top: 1px solid #ccc;
        -webkit-transform: scale(.5);
        transform: scale(.5);
        -webkit-transform-origin: 0 0;
        transform-origin: 0 0;
        width: 2.5rem;
        position: absolute;
        left: 0.15rem;
        top: 0.24rem;
        pointer-events: none;
        content: "";
        box-sizing: border-box;
       }
       h5::after{
          border-top: 1px solid #ccc;
        -webkit-transform: scale(.5);
        transform: scale(.5);
        -webkit-transform-origin: 0 0;
        transform-origin: 0 0;
        width: 2.5rem;
        position: absolute;
        right:-1.1rem;
        top: 0.24rem;
        pointer-events: none;
        content: "";
        box-sizing: border-box;
       }
     }
     p{
       color:#999999;
       font-size:0.15rem;
       text-align:center;
     }
     strong{
       width:0.91rem;
       display:block;
       color:#979797;
       height:0.32rem;
       line-height:0.32rem;
       font-weight:500;
       border:1px solid #C8C8C8;
       border-radius:2px;
       margin:0rem auto;
       margin-bottom: 0.15rem;
       text-align:center;
     }
   }
</style>
