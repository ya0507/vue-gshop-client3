<template>
  <section class="loginContainer">
    <div class="loginInner">
      <div class="login_header">
        <h2 class="login_logo">硅谷外卖</h2>
        <div class="login_header_title">
          <a href="javascript:;" :class="{on: loginType}" @click="loginType=true">短信登录</a>
          <a href="javascript:;" :class="{on: !loginType}" @click="loginType=false">密码登录</a>
        </div>
      </div>
      <div class="login_content">
        <form>
          <div :class="{on: loginType}">
            <section class="login_message">
              <input type="tel" maxlength="11" placeholder="手机号" v-model="phone">
              <button :disabled="!isRightPhone || computeTime>0" class="get_verification" 
                :class="{right_phone_number: isRightPhone}" @click.prevent="sendCode">
                {{computeTime>0 ? `已发送验证码(${computeTime}s)` : '获取验证码'}}
              </button>
            </section>
            <section class="login_verification">
              <input type="tel" maxlength="8" placeholder="验证码" v-model="code">
            </section>
            <section class="login_hint">
              温馨提示：未注册硅谷外卖帐号的手机号，登录时将自动注册，且代表已同意
              <a href="javascript:;">《用户服务协议》</a>
            </section>
          </div>
          <div :class="{on: !loginType}">
            <section>
              <section class="login_message">
                <input type="text" placeholder="用户名" v-model="name">
              </section>
              <section class="login_verification">
                <input :type="isShowPwd ? 'text' : 'password'" maxlength="8" placeholder="密码" v-model="pwd">
                <div class="switch_button" :class="isShowPwd ? 'on' : 'off'" @click="isShowPwd = !isShowPwd">
                  <div class="switch_circle" :class="{right: isShowPwd}"></div>
                  <span class="switch_text">{{isShowPwd ? 'abc' : ''}}</span>
                </div>
              </section>
              <section class="login_message">
                <input type="text" maxlength="11" placeholder="验证码" v-model="captcha">
                <img class="get_verification" src="http://localhost:5000/captcha" alt="captcha"
                  @click="updateCapcha" ref='captcha'>
              </section>
            </section>
          </div>
          <button class="login_submit" @click.prevent="login">登录</button>
        </form>
        <a href="javascript:;" class="about_us">关于我们</a>
      </div>
      <a href="javascript:" class="go_back" @click="$router.back()">
        <i class="iconfont icon-jiantou2"></i>
      </a>
    </div>
  </section>
</template>

<script type="text/ecmascript-6">
 
  import { reqSendCode, reqPwdLogin, reqSmsLogin } from '../../api'
  import { RECEIVE_USER } from '../../vuex/mutation-types'

  export default {

    data () {
      return {
        /* 设计数据的时候，需要确定的是数据值类型及名称 */
        loginType:false, //登陆的类型，显示登陆界面： true: 短信登陆, false: 密码登陆
        phone:'',//手机号
        code:'',//短信验证码
        name:'',
        pwd:'',//密码
        captcha:'',//图形验证码
        computeTime:0 , //刚开始的时候没有计时是从0开始（计时的剩余时间为0，即也没有开始）
         isShowPwd:false,//是否显示密码，默认是不显示 
      }
    
    },

    /*计算属性 */
    computed:{
      isRightPhone(){
        /* 用于验证是否是正确手机号（正则）/^1\d{10}$/ ---->以1开头，\d表示数字，｛10｝以十个数字结尾 */
        return /^1\d{10}$/.test(this.phone)
      }
    },


    /* 更新数据的方法，写的都是一些回调 */
    methods: {
     async sendCode(){//发送验证码
      //设置最大时间
      this.computeTime =10
      const timeid = setInterval(() => {
         this.computeTime--
         //判断计时器，如果到0的话，就清除计时器
         if(this.computeTime===0){
           clearInterval(timeid)
         }
       },1000);

        //发送短信验证码的请求函数(发送ajax请求函数)
        const result = await reqSendCode( this.phone)
        if(result.code===0){
          alert('短信已成功发送')
        }else{
          alert(result.msg)
        }


      },

      /* 更新图形码显示 */
      updateCapcha(){
        //给img指定一个新的src值, 携带一个时间戳的参数
        this.$refs.captcha.src='http://localhost:5000/captcha?time=' +Data.now()
      },

      /* 发送登陆的请求(需要确定的是密码登陆还是短信登陆) */
      async login(){
          const {loginType,phone,name,pwd,code,captcha} =this
          /*密码登陆 */
          let result 
          if(!loginType){
            result = await reqPwdLogin({name,pwd,captcha})
          }else{
            // 短信登陆
            result =  await reqSmsLogin(phone,code)
          }
          // 根据结果进行响应 处理
          console.log('result',result);
          // 如果登陆成功，就要对用户的信息进行保存
          if(result.code===0){
            //将用户信息存储到state中
            const user = result.data
            this.$store.dispatch('recordUser',{user})
            // 直接跳转到个人中心
             this.$router.replace('/profile')
          }else{ //登陆失败的话，对用户信息提示
            alert(result.msg)
          }
      
          
        }

      
    }

  }

  
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import '../../common/stylus/mixins.styl'

  .loginContainer
    width 100%
    height 100%
    background #fff
    .loginInner
      padding-top 60px
      width 80%
      margin 0 auto
      .login_header
        .login_logo
          font-size 40px
          font-weight bold
          color #02a774
          text-align center
        .login_header_title
          padding-top 40px
          text-align center
          >a
            color #333
            font-size 14px
            padding-bottom 4px
            &:first-child
              margin-right 40px
            &.on
              color #02a774
              font-weight 700
              border-bottom 2px solid #02a774
      .login_content
        >form
          >div
            display none
            &.on
              display block
            input
              width 100%
              height 100%
              padding-left 10px
              box-sizing border-box
              border 1px solid #ddd
              border-radius 4px
              outline 0
              font 400 14px Arial
              &:focus
                border 1px solid #02a774
            .login_message
              position relative
              margin-top 16px
              height 48px
              font-size 14px
              background #fff
              .get_verification
                position absolute
                top 50%
                right 10px
                transform translateY(-50%)
                border 0
                color #ccc
                font-size 14px
                background transparent
                &.right_phone_number
                  color black
            .login_verification
              position relative
              margin-top 16px
              height 48px
              font-size 14px
              background #fff
              .switch_button
                font-size 12px
                border 1px solid #ddd
                border-radius 8px
                transition background-color .3s,border-color .3s
                padding 0 6px
                width 30px
                height 16px
                line-height 16px
                color #fff
                position absolute
                top 50%
                right 10px
                transform translateY(-50%)
                &.off
                  background #fff
                  .switch_text
                    float right
                    color #ddd
                &.on
                  background #02a774
                >.switch_circle
                  //transform translateX(27px)
                  position absolute
                  top -1px
                  left -1px
                  width 16px
                  height 16px
                  border 1px solid #ddd
                  border-radius 50%
                  background #fff
                  box-shadow 0 2px 4px 0 rgba(0,0,0,.1)
                  transition transform .3s
                  &.right
                    transform translateX(27px)
            .login_hint
              margin-top 12px
              color #999
              font-size 14px
              line-height 20px
              >a
                color #02a774
          .login_submit
            display block
            width 100%
            height 42px
            margin-top 30px
            border-radius 4px
            background #4cd96f
            color #fff
            text-align center
            font-size 16px
            line-height 42px
            border 0
        .about_us
          display block
          font-size 12px
          margin-top 20px
          text-align center
          color #999
      .go_back
        position absolute
        top 5px
        left 5px
        width 30px
        height 30px
        >.iconfont
          font-size 20px
          color #999
</style>
