<template>
  <div class="header">
    <img src="../assets/header.png">
        <div class="font">
            <h5>{{title}}</h5>
            <p>{{tip}}</p>
        </div>
  </div>
</template>

<script>

export default {
  name: 'header',
  data () {
    return {
        title:"商户自营销平台",
        tip: "发掘您的营销潜力",
        headerBg :""
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.header{
   position:relative;
   .font{
     position:absolute;
     color:#fff;
     width:100%;
     margin:0 auto;
     top:28%;
     h5{
       font-size:0.3rem;
       text-align:center;
     }
     p{
       font-size:0.16rem;
       color:#aba9ac;
       width:1.30rem;
       margin:0.1rem auto;
       position:relative;
     }
     p:before{
      border-top: 1px solid #fff;
      -webkit-transform: scale(.5);
      transform: scale(.5);
      -webkit-transform-origin: 0 0;
      transform-origin: 0 0;
      width: 0.5rem;
      position: absolute;
      left: -0.35rem;
      top: 0.08rem;
      pointer-events: none;
      content: "";
      box-sizing: border-box;
     }
     p::after{
      border-top: 1px solid #fff;
      -webkit-transform: scale(.5);
      transform: scale(.5);
      -webkit-transform-origin: 0 0;
      transform-origin: 0 0;
      width: 0.5rem;
      position: absolute;
      right: -0.55rem;
      top: 0.08rem;
      pointer-events: none;
      content: "";
      box-sizing: border-box;
     }
   }
 }
</style>
