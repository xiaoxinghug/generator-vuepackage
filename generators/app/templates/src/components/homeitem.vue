<template>
  <div class="home-item">
       <a href='https://h5.dianping.com/app/gfe-app-microposter-info/index.html'>
          <div class="item">
              <div class="img"><img src="../assets/imglib.png" alt=""></div>
              <div class="font">
                  <h5>精美图库</h5>
                  <p>为客户制作精美的朋友圈长图</p>
              </div>
              <div class="last">
                  <div class="right"></div>
              </div>
          </div>
       </a>  
       <router-link :to = "'/plat'">
          <div class="item">
                    <div class="img"><img src="../assets/fuli.png" alt=""></div>
                    <div class="font">
                        <h5>自助福利卡</h5>
                        <p>店铺福利，价格优惠我做主</p>
                    </div>
                    <div class="last">
                        <div class="right"></div>
                  </div>
          </div>
      </router-link>
       <div class="more-template">
            <p>更多模板 敬请期待</p>
       </div>
  </div>
</template>

<script>
export default {
  name: 'homeitem',
  data () {
    return {

    }
  },
   components: {
      
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  @import "../less/util.less";
  a{
    color:#000;
    display:block;
    margin-top:0.1rem;
  }
  a:first-child{
      margin-top:0px;
    }
  .home-item{
    padding:0.15rem;
    background-color:#fff;
    .item{
      background-color:#f5f5f5;
      padding:0.16rem 0.15rem;
      .flexbox();
    }
    
    .font{
      .boxflex(1);
      padding:0.05rem 0.15rem;
      h5{
        font-size:0.16rem;
      }
      p{
        color:#999999;
        font-size:0.12rem;
        padding-top:0.07rem;
      }
    }
    .img{
      width:0.45rem;
      height:0.45rem;
    }
    .last{
      height:0.45rem;
      width:0.2rem;
      position:relative;
    }
    .right{
      position:absolute;
      top:0.17rem;
      right:0rem;
      width:0.06rem;
      height:0.11rem;
      background:url(../assets/right.png)no-repeat center;
      background-size:contain;
    }
    .more-template{
      p{
        font-size:0.13rem;
        color:#aba9ac;
        width:1.35rem;
        margin:0.15rem auto;
        margin-top:0.25rem;
        text-align:center;
        position:relative;
      }
      p:before{
        border-top: 1px solid #ccc;
        -webkit-transform: scale(.5);
        transform: scale(.5);
        -webkit-transform-origin: 0 0;
        transform-origin: 0 0;
        width: 1.9rem;
        position: absolute;
        left: -1.05rem;
        top: 0.08rem;
        pointer-events: none;
        content: "";
        box-sizing: border-box;
      }
      p::after{
        border-top: 1px solid #ccc;
        -webkit-transform: scale(.5);
        transform: scale(.5);
        -webkit-transform-origin: 0 0;
        transform-origin: 0 0;
        width: 1.9rem;
        position: absolute;
        right: -2.0rem;
        top: 0.08rem;
        pointer-events: none;
        content: "";
        box-sizing: border-box;
      }
    }
  }
</style>
