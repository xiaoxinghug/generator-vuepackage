<template>
  <div class="setinfor-box">
       <div class="inforbg">
            <img src="../assets/welfare.png" alt=""/>
            <router-link :to = "'/plat'">
              <span style="position:absolute;font-size:0.3rem;color:#b15317;top:5%;right:9%;">×</span>
            </router-link>      
            <div class="form">
               <p>设置以下字段</p>
               <p style="padding:0.1rem;">一键生成您的专享福利卡</p>
               <div class="form-content">
                   <input type="text"maxlength="12"placeholder="请输入优惠内容，限12字以内"v-model="formDate.discountcontent"style="margin-top:0.03rem"/>
                      <div class="date selectstore"@click="toSelect()">
                              <div>{{formDate.selectmdtext}}</div>
                              <span class="right"></span>
                      </div>
                   <div class="date">
                      <date-picker field="myDate"
                        :placeholder="dateText"
                        v-model="startTime"
                        format="yyyy-mm-dd"
                        :backward="false"
                        :no-today="true"
                        :forward="true"></date-picker>
                      <span class="right"></span>
                   </div>
                   <div class="date">
                      <date-picker field="myDate"
                        :placeholder="dataText"
                        v-model="endTime"
                        format="yyyy-mm-dd"
                        :backward="false"
                        :no-today="true"
                        :forward="true"></date-picker>
                      <span class="right"></span>
                   </div>
               </div>
               <div class="btn"@click="sendData()">生成福利卡</div>
            </div>
       </div>
       <tip-component :config="{tipInfor}"></tip-component>
  </div>
</template>

<script>
const isAlpha = location.host.indexOf('dianping') > -1;
const data_host = isAlpha ? 'apie.dianping.com' : 'apie.51ping.com';
import myDatepicker from 'vue-datepicker-simple/datepicker-2.vue'; //引入对应的组件
import TipComponent from './tip.vue';
import fetchJsonp from "fetch-jsonp";
export default {
  name: 'date',
  data () {
    return {
      dateText:"优惠生效时间",
      dataText:"优惠失效时间",
      startTime:"",
      endTime:"",
      tipInfor:"",
      formDate:{
        discountcontent:"",
        selectmdtext:""
      }
    }
  },
  created(){
    this.formDate.selectmdtext = this.$store.state.shopName;
    this.formDate.discountcontent = this.$store.state.discountcontent;
    this.endTime = this.$store.state.endTime;
    this.startTime = this.$store.state.startTime;
    this.shopId = this.$store.state.shopId;   
  },
  mounted(){
    this.setStatic();
  },
  methods:{
    sendData (){
      // this.$store.dispatch('SUB_MIT',dateTime)
      if (this.formDate.discountcontent ==""){
          this.$store.state.tipInfor = "优惠内容是空";
          return;
      }
      if (this.formDate.selectmdtext =="适用门店"){
          this.$store.state.tipInfor = "未填写门店";
          return;
      }
      if (this.startTime ==""){
          this.$store.state.tipInfor = "开始时间是空";
          return;
      }
      if (this.endTime ==""){
          this.$store.state.tipInfor = "结束时间是空";
          return;
      }
      let STime = new Date(this.startTime).getTime(),
          ETime = new Date(this.endTime).getTime();
      if (STime > ETime){
         this.$store.state.tipInfor = "失效时间不符合";
         return;
      }
      let url = `https://${data_host}/marketing/microwelfare/createactivity`+'?welfareContent='+this.formDate.discountcontent+'&applyShopId='+this.shopId+'&beginTime='+this.startTime+'&endTime='+this.endTime
        fetchJsonp(url)
        .then(res => res.json())
        .then(data => {
          if (data.code == 200){
              this.$router.push('plat');
          }
        })
        .catch(err => {
          console.log(err)
        })
      
    },
    setStatic (){
      this.$nextTick(function () {
         let inputs = document.getElementsByTagName('input');
             inputs[1].setAttribute('readonly','readonly');
             inputs[2].setAttribute('readonly','readonly');
      })
    },
    toSelect (){
      this.$store.state.discountcontent = this.formDate.discountcontent;
      this.$store.state.endTime = this.endTime;
      this.$store.state.startTime = this.startTime;
      console.log(this.$store.state);
      this.$router.push('selectmd')
    }
  },
  components: {
        // DateComponent
        'date-picker': myDatepicker,
        TipComponent
  }
}
</script>

<style lang="less">
  input::-webkit-input-placeholder, textarea::-webkit-input-placeholder { 
    color: #d68440; 
   } 
  .vue-datepicker input{
    width:2.26rem !important;
    background-color:#f9df95;
    color:#994d0f !important;
    border:0px solid #cca366 !important;
  }
  .vue-datepicker input[placeholder="优惠生效时间"]{
        border-bottom:1px solid #cca366 !important;
  }
  .vue-datepicker .vue-datepicker-panels{
        width:2.13rem !important;
        max-height:1.5rem;
        overflow-y:scroll;
  }
  .vue-datepicker .vue-datepicker-panel .vue-datepicker-tb, .vue-datepicker .vue-datepicker-panel .vue-datepicker-tb2{
       width:2.13rem !important;
  }
  .vue-datepicker input{
    padding-left:0px !important;
  }
  .vue-datepicker .vue-datepicker-panel .vue-datepicker-month span{
          width:1.40rem !important;
    }
  .vue-datepicker .vue-datepicker-panel .vue-datepicker-tb tbody tr td, .vue-datepicker .vue-datepicker-panel .vue-datepicker-tb2 tbody tr td{
         height:0.21rem !important;
      }  
  @media screen  and (max-width: 320px) {
      .vue-datepicker .vue-datepicker-panel .vue-datepicker-month span{
          width:1.30rem !important;
      }
  }
  .vue-datepicker .vue-datepicker-panel .vue-datepicker-tb tbody tr td.z-existed.z-on span, .vue-datepicker .vue-datepicker-panel .vue-datepicker-tb2 tbody tr td.z-existed.z-on span{
     background-color:#994d0f !important;
  }
  .selectstore{
    background-color: #f9df95;
    border-bottom: 1px solid #cca366;
    width: 2.24rem;
    height: 0.43rem;
    font-size: 0.12rem;
    text-indent: 0.1rem;
    color:#d68440;
    line-height:0.43rem;
  }
  .date{
    position:relative;
    .right{
      display:inline-block;
      position:absolute;
      height:0.11rem;
      width:0.06rem;
      right:0.1rem;
      top:0.17rem;
      background:url(../assets/inforright.png)no-repeat center;
      background-size:contain;
    }
  }
   .setinfor-box{
      position:fixed;
      left:0px;
      right:0px;
      top:0px;
      bottom:0px;
      background:#1d1d1f;
      .btn{
          width:2rem;
          height:0.5rem;
          background-color:#f1d28d;
          margin:0 auto;
          color:#b15317;
          line-height:0.5rem;
          border-radius:0.25rem;
          font-size:0.2rem;
          text-align:center;
          margin-top:0.15rem;
        }
      .form-content{
        
        input{
          background-color:#f9df95;
          border:none;
          border-bottom:1px solid #cca366;
          width:2.22rem;
          height:0.42rem;
          font-size:0.12rem;
          // padding-left:0.1rem;
          text-indent:0.1rem;
          border-radius:0px;
        }
      }
      .inforbg{
        position:relative;
        .form{
          position:absolute;
          width:100%;
          top:2.15rem;
          .form-content{
            width:2.27rem;
            height:1.82rem;
            background-color:#f9df95;
            border-radius:4px;
            margin:0 auto;
          }
          p{
            font-size:0.14rem;
            color:#a81a52;
            text-align:center;
          }
        }
      }
   }
</style>
