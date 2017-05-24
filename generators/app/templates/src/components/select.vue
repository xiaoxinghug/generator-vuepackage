<template>
  <div>
    <div class="fix-view flex-box" :class="{Hide: closeFix}" v-if="shopMap">
      <div class="fix-view-left">
        <ul class="md-citys">
          <li class="md-city" v-for="(item, index) in shopMap" @click="changeCity(index)" :class="{on: selCity == index}">{{index}}</li>
        </ul>
      </div>
      <div class="fix-view-right flex-one">
        <ul class="md-list">
          <li class="md-li" v-for="item in shopMap[selCity]" @click="myselShop(item)">
            <span class="md-text">{{item.shopName}}</span>
            <span class="md-sel-icon" v-bind:class="{on: selShop && item.shopId == selShop.shopId}"></span>
          </li>
        </ul>
      </div>
      <div class="sel-md-button">
        <span @click="sureShopName()">确定</span>
      </div>
      <tip-component :config="{tipInfor}"></tip-component>
    </div>
    <loading-component :config="{loadingText}"></loading-component>
  </div>
</template>

<script>
const isAlpha = location.host.indexOf('dianping') > -1;
const data_host = isAlpha ? 'apie.dianping.com' : 'apie.51ping.com';
import fetchJsonp from "fetch-jsonp";
import TipComponent from './tip.vue';
import LoadingComponent from "./loading.vue";
export default {
  name: 'select',
  data () {
    return {
       closeFix: true,
       selShop: null,
       shopMap: null,
       selCity: null,
       tipInfor: "",
       loadingText: "加载中..."
    }
  },
  props: ['config'],
  created (){
    this.getShopMap();
    this.$store.state.shopName = "适用门店";
  },
  mounted() {
    
  },
  methods:{
    getShopMap() {
        let url = `https://${data_host}/micro/poster/shopList`
        fetchJsonp(url)
        .then(res => res.json())
        .then(data => {
          if (data.shopMap == null){
            this.loadingText = "加载失败...";
          } else{
            this.shopMap = data.shopMap;
            this.loadingText = "";
            for (let item in data.shopMap) {
                this.selCity = item
                break;
            }
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    myselShop(item) {
        this.selShop = item;
    },
    sureShopName (){
      if (this.selShop && this.selShop.shopName){
          this.$store.state.shopName = this.selShop.shopName;
          this.$store.state.shopId = this.selShop.shopId;
          this.$router.push('setinfor');
      }else {
          this.$store.state.tipInfor = "请选择门店";
      }
    },
    changeCity(item) {
        this.selCity = item
    }
  },
  components: {
    TipComponent,
    LoadingComponent
  }
}
</script>

<style lang="less">
.flex-box {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
}
.flex-one {
    width: 0;
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
}
  .fix-view {
      position: fixed;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      background: #fff;
      .fix-view-left {
          width:1.05rem;
          background: #f5f5f5;
          overflow-x: hidden;
          overflow-y: auto;
          padding-bottom:0.65rem;
          .md-city {
              height:0.45rem;
              font-size: 0.15rem;
              line-height: 0.45rem;
              padding-left: 0.14rem;
              color: #333;
          }
          .md-city.on {
              background: #ddd;
          }
      }
      .fix-view-right {
          overflow-x: hidden;
          overflow-y: auto;
          padding-bottom: 0.65rem;
          .md-li {
              height: 0.45rem;
              font-size: 0.15rem;
              line-height: 0.45rem;
              margin-left: 0.1rem;
              border-bottom: 1px solid #ddd;
              box-sizing: border-box;
              position: relative;
              .md-text {
                  color: #333;
              }
              .md-sel-icon {
                  position: absolute;
                  width: 0.24rem;
                  height:0.24rem;
                  background: url(../assets/sel-off.png) no-repeat;
                  background-size: contain;
                  top: 0.12rem;
                  right: 0.14rem;
              }
              .md-sel-icon.on {
                  background-image: url(../assets/sel-on.png);
              }
          }
      }
      .sel-md-button {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 0.64rem;
          background: #fff;
          border-top: 1px solid #e0e0e0;
          span {
              display: block;
              width: 92%;
              height: 0.43rem;
              line-height: 0.43rem;
              text-align: center;
              margin: 0.105rem 4%;
              background: #f63;
              color: #fff;
              font-size: 0.16rem;
              border-radius: 0.02rem;
          }
      }
  }
</style>
