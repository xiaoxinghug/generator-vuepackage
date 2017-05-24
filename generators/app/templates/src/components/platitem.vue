<template>
  <div>
  <div class="palt-item"v-if="itemList && itemList.length > 0">
       <div class="item"v-for="(item,index) in itemList">
            <div class="welfare">
                <div class="content">
                  <div class="left">
                  </div>
                  <div class="right">
                     <h5>{{item.activityContent}}</h5>
                     <p class="center">{{item.shopNameDesc}}</p>
                     <p>{{item.effectTimeDesc}}</p>
                  </div>
                </div>
            </div>
            <div class="bottom">
               <div class="left">
                  <span>浏览量<span style="padding-left:0.05rem">{{item.scanNum}}</span></span>
               </div>
               <div class="right">
                  <span@click="delList(item.activityId,index)">删除</span>
                     <span@click="shareWx(item.shopNameDesc,item.url)">分享客户</span>
               </div>
            </div>
      </div>
    </div>
    <loading-component :config="{loadingText}"></loading-component>
  </div>
  
</template>

<script>
const isAlpha = location.host.indexOf('dianping') > -1;
const data_host = isAlpha ? 'apie.dianping.com' : 'apie.51ping.com';
const share_url = isAlpha ? "https://g.dianping.com/av/rainbow/1201872/index.html?utm_source=wx&activityId=":"https://g.51ping.com/av/rainbow/1201872/index.html?utm_source=wx&activityId=";
import DPZeus from "@dp/dpzeus"
import fetchJsonp from "fetch-jsonp";
import LoadingComponent from "./loading.vue";
export default {
  name: 'platitem',
  data () {
    return {
       itemList:null,
       loadingText: "加载中..."
    }
  },
  created(){
    this.getList();
  },
  methods:{
    getList (){
      let url = `https://${data_host}/marketing/microwelfare/activitylist`
        fetchJsonp(url)
        .then(res => res.json())
        .then(data => {
          if (data.code == 200){
              this.loadingText = "";
              for (var i = 0 ; i < data.activityDetails.length ; i++){
                  this.$set(data.activityDetails[i],'url',share_url+data.activityDetails[i].activityId)
              }
              this.itemList =  data.activityDetails;
          }else{
              this.loadingText = "加载失败...";
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    delList (Id,index){
     let url = `https://${data_host}/marketing/microwelfare/cancelactivity`+'?activityId='+Id;
        fetchJsonp(url)
        .then(res => res.json())
        .then(data => {
          if (data.code == 200){
              this.itemList.splice(index,1);
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    shareWx (title,url){
      DPZeus.ready(function(){
        DPZeus.share({
          title: title+'给您发了一份专属福利，赶紧分享给您的好友吧！',
          desc: '为了回馈您的信赖，特邀您领取神秘福利，分享给好友到店使用，先到先得哦',
          content: '为了回馈您的信赖，特邀您领取神秘福利，分享给好友到店使用，先到先得哦',
          image: "https://p1.meituan.net/dpnewvc/86ee7d2e8a64e5d59a5ce5e8bc4e76033269.png",
          url: url,
          channel: [DPZeus.Share.WECHAT_TIMELINE, DPZeus.Share.WECHAT_FRIENDS],
          success: function(data){
              // alert(JSON.stringify(data));
          },
          fail: function (error) {
              // alert(JSON.stringify(error));
          }
        });
      })
    }
  },
   components: {
      LoadingComponent
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  @import "../less/util.less";
   .palt-item{
      h5{
        font-size:0.16rem;
      }
     .item{
       padding:0.10rem 0.1rem 0rem 0.1rem;
       background-color:#fff;
       margin-bottom:0.1rem;
     }
     .welfare{
       height:0.83rem;
       background:url(../assets/platform_itembg.png) no-repeat center;
       background-size:contain;
       .content{
         padding:0.15rem;
         .flexbox();
       }
       .left{
         width:0.54rem;
         height:0.54rem;
         background:url(../assets/platform_fuli.png) no-repeat center;
         background-size:contain;
         position:relative;
       }
       .left::after{
         position:absolute;
         content:"";
         height:0.55rem;
         width:0.01rem;
         background-color:#D8D8D8;
         margin:0px 0.2rem;
         left:0.45rem;
       }
       .right{
         .boxflex(1);
         margin-left:0.25rem;
         p{
           font-size:0.12rem;
           color:#666666;
         }
         .center{
           margin:0.05rem 0rem;
         }
       }
     }
     .bottom{
       .flexbox();
       height:0.3rem;
       line-height:0.3rem;
       padding:0.1rem 0px;
       .left{
         width:0.84rem;
         height:0.16rem;
         font-size:0.12rem;
         opacity:0.6;
         color:#666666;
       }
       .right{
         .boxflex(1);
         text-align:right;
         span{
           display:inline-block;
           width:0.8rem;
           border:1px solid #FF8099;
           border-radius:2px;
           text-align:center;
           color:#FF8099;
         }
         span:first-child{
          border:1px solid #999999;
          color:#666666;
          margin-right:0.1rem;
         }
       }
     }
   }
</style>
