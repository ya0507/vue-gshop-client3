<template>
  <section class="loginContainer">
    <div class="loginInner">
      <div class="login_header">
        <h2 class="login_logo">硅谷外卖</h2>
        <div class="login_header_title">
          <a href="javascript:;" :class="{on: loginWay}" @click="loginWay=true">短信登录</a>
          <a href="javascript:;" :class="{on: !loginWay}" @click="loginWay=false">密码登录</a>
        </div>
      </div>
      <div class="login_content">
        <form>
          <div :class="{on: loginWay}">
            <section class="login_message">
              <input type="tel" maxlength="11" placeholder="手机号" name="phone" 
              v-model="phone" v-validate="'required|mobile'">
              <!-- v-model="phone" v-validate="{required: true,regex: /^1\d{10}$/}" -->
              <button :disabled="!isRightPhone || computeTime>0" class="get_verification" 
              :class="{right_phone_number: isRightPhone}" @click.prevent="sendCode">
              {{computeTime>0 ? `验证码已发送(${computeTime}s)` : '获取验证码'}}
              </button>
              <span style="color: red;" v-show="errors.has('phone')">{{ errors.first('phone') }}</span>
            </section>
            <section class="login_verification">
              <input type="tel" maxlength="8" placeholder="验证码" name="code" v-model="code">
            </section>
            <section class="login_hint">
              温馨提示：未注册硅谷外卖帐号的手机号，登录时将自动注册，且代表已同意
              <a href="javascript:;">《用户服务协议》</a>
            </section>
          </div>
          <div :class="{on: !loginWay}">
            <section>
              <section class="login_message">
                <input type="text" maxlength="11" placeholder="用户名" 
                name="name" v-model="name" v-validate="'required'">
                <span v-show="errors.has('name')" style="color: red">{{ errors.first('name') }}</span>
              </section>
              <section class="login_verification">
                <input :type="isShowPwd ? 'text' : 'password'" maxlength="8" placeholder="密码" name="pwd" v-model="pwd">
                <div class="switch_button" :class="isShowPwd ? 'on' : 'off'" @click="isShowPwd = !isShowPwd">
                  <div class="switch_circle" :class="{right: isShowPwd}"></div>
                  <span class="switch_text">{{isShowPwd ? 'abc' : ''}}</span>
                </div>
              </section>
              <section class="login_message">
                <input type="text" maxlength="11" placeholder="验证码" name="captcha" v-model="captcha">
                <img ref="captcha" class="get_verification" src="http://localhost:5000/captcha" alt="captcha" @click="updateCaptcha">
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
  import { Toast, MessageBox } from 'mint-ui'
  import { setInterval, clearInterval } from 'timers'
  import {reqSendCode, reqSmsLogin, reqPwdLogin} from '../../api'
  import {RECEIVE_USER} from '../../vuex/mutation-types'
  
  export default {
    data () {
      return {
        loginWay: false, // true: 短信登陆, false: 密码登陆
        phone: '', // 手机号
        code: '', // 一性短信验证码
        name: '', // 用户名
        pwd: '', // 密码
        captcha: '', // 一次性图形验证码
        computeTime: 0, // 计时剩余时间
        isShowPwd: false, // 是否显示密码

      }
    },

    computed: {
      // 判断phone是否是一个正确的手机号
      isRightPhone () {
        return /^1\d{10}$/.test(this.phone)
      }
    },

    methods: {
      async sendCode () {
        // 显示最大值
        this.computeTime = 10
        // 启动循环计时器, 每隔1s减1
        const intervalId = setInterval(() => {
          this.computeTime--
          if (this.computeTime<=0) {
            this.computeTime = 0
            // 停止计时
            clearInterval(intervalId)
          }
        }, 1000);

        // 请求发送验证码
        const response = await reqSendCode(this.phone)
        const result = response.data
        if (result.code===0) {
          // alert('短信发送成功')
          Toast('短信发送成功');
        } else {
          // 停止计时
          this.computeTime = 0
          // alert(result.msg)
          MessageBox.alert(result.msg)
        }
      },

      /* 
      登陆
      */
      async login () {
        const {loginWay, phone, code, name, pwd, captcha} = this
        let names
        if (loginWay) {
          names = ['phone']
        } else {
          names = ['name']
        }
        
        // 进行统一的前台表单验证
        const success = await this.$validator.validateAll(names)
        // 验证通过后发ajax请求
        if (success) {
          let response
          // alert('验证通过, 发ajax请求')
          if (loginWay) {
             response = await reqSmsLogin(phone, code)
          } else {
            response = await reqPwdLogin({name, pwd, captcha})
          }
          const result = response.data

          // 根据请求的结果进行处理
          if (result.code===0) { // 登陆成功
            const user = result.data
            // 保存user
            this.$store.commit(RECEIVE_USER, user)
            // 跳转到个人中心
            this.$router.replace('/profile')
          } else { // 登陆失败
            alert(result.msg)
          }
         
        }
      },

      /* 
      更新图形验证码
      */
     updateCaptcha () {
       // 给img指定一个新的src路径值, 携带一个时间戳参数
       this.$refs.captcha.src = 'http://localhost:5000/captcha?time=' + Date.now()
     }
    },


    // 在当前组件对象被创建前调用, 不能直接访问this(不是组件对象)
    // 但可以通过next(component => {}), 在回调函数中访问组件对象
    beforeRouteEnter (to, from, next) {
      console.log('Login beforeRouteEnter()', this)

      // 指定回调函数在组件对象创建之后立即执行, 并传递新创建组件对象
      next((component) => {
        // 如果已经登陆, 强制跳转到个人中心
        if (component.$store.state.user.user._id) {
          next('/profile')
        } else {
          // 否则放行
          next()
        }
      })
    },
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
