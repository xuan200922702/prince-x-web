<template>
  <common-layout>
    <div class="top">
      <div class="header">
        <img alt="logo" class="logo" src="@/assets/img/logo.png" />
        <span class="title">{{systemName}}</span>
      </div>
      <div class="desc">灵活、强大、功能全面的开源Devops平台</div>
    </div>
    <div class="login">
      <a-form @submit="onSubmit" :form="form">
        <a-tabs size="large" :tabBarStyle="{textAlign: 'center'}" style="padding: 0 2px;">
          <a-tab-pane tab="用户密码登录" key="1">
            <a-alert type="error" :closable="true" v-show="error" :message="error" showIcon style="margin-bottom: 24px;" />
            <a-form-item>
              <a-input
                autocomplete="autocomplete"
                size="large"
                placeholder="请输入用户名"
                v-decorator="['username', {rules: [{ required: true, message: '请输入用户名', whitespace: true}]}]"
              >
                <a-icon slot="prefix" type="user" />
              </a-input>
            </a-form-item>
            <a-form-item>
              <a-input-password
                size="large"
                placeholder="请输入密码"
                autocomplete="autocomplete"
                type="password"
                v-decorator="['password', {rules: [{ required: true, message: '请输入密码', whitespace: true}]}]"
              >
                <a-icon slot="prefix"  v-show="true"  type="lock" />
              </a-input-password>
            </a-form-item>
            <a-form-item>
              <a-row :gutter="8" style="margin: 0 -4px">
                <a-col :span="16">
                  <a-input size="large"
                           placeholder="请输入验证码"
                           v-decorator="['code', {rules: [{ required: true, message: '请输入验证码', whitespace: true}]}]"
                  >
                    <a-icon slot="prefix" type="check-circle" />
                  </a-input>
                </a-col>
                <a-col :span="8" class="codeimg"  style="padding-left: 4px">
                  <img   style="width: 100%" :src="codeImg" @click="refreshCode">
                </a-col>
              </a-row>
            </a-form-item>
          </a-tab-pane>
          <a-tab-pane tab="LDAP登录" key="2">

          </a-tab-pane>
        </a-tabs>
        <div>
          <a-checkbox :checked="true" >自动登录</a-checkbox>
          <a style="float: right">忘记密码</a>
        </div>
        <a-form-item>
          <a-button :loading="logging" style="width: 100%;margin-top: 24px" size="large" htmlType="submit" type="primary">登录</a-button>
        </a-form-item>
<!--        <div>-->
<!--          其他登录方式-->
<!--          <a-icon class="icon" type="alipay-circle" />-->
<!--          <a-icon class="icon" type="taobao-circle" />-->
<!--          <a-icon class="icon" type="weibo-circle" />-->
<!--          <router-link style="float: right" to="/dashboard/workplace" >注册账户</router-link>-->
<!--        </div>-->
      </a-form>
    </div>
  </common-layout>
</template>

<script>
import CommonLayout from '@/layouts/CommonLayout'
import {login, getcode,getRoutesConfig} from '@/services'
import {setAuthorization} from '@/utils/request'
import {loadRoutes} from '@/utils/routerUtil'

export default {
  name: 'Login',
  components: {CommonLayout},
  data () {
    return {
      logging: false,
      error: '',
      form: this.$form.createForm(this),
      uuid: '',
      code: '',
      codeImg: '',
      icon: '',
    }
  },
  computed: {
    systemName () {
      return this.$store.state.setting.systemName
    },
  },
  mounted() {
    this.refreshCode()
  },
  methods: {
    refreshCode(){
      getcode().then(res =>{
        this.uuid  = res.data.id
        this.codeImg = res.data.data
      })
    },
    onSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err) => {
        if (!err) {
          this.logging = true
          const username = this.form.getFieldValue('username')
          const password = this.form.getFieldValue('password')
          const code  = this.form.getFieldValue('code')
          const uuid = this.uuid
          login(username, password,code,uuid).then(this.afterLogin)
        }
      })
    },
    afterLogin(res) {
      this.logging = false
      const loginRes = res.data
      const token =loginRes.token
      console.log(token)
      if (loginRes.code === 200) {
        setAuthorization({token: token,expireAt: new Date(new Date().getTime() + 3600 * 1000)})
        // 获取路由配置
        getRoutesConfig().then(result => {
          const routesConfig = result.data.data
          loadRoutes({router: this.$router, store: this.$store, i18n: this.$i18n}, routesConfig)
          this.$router.push('/dashboard/workplace')
          this.$message.success(loginRes.msg, 3)
        })
      } else {
        this.error = loginRes.message
        this.$message.error(loginRes.msg, 3)
        if (loginRes.code ===400){
          this.refreshCode()
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .common-layout{
    .top {
      text-align: center;
      .header {
        height: 44px;
        line-height: 44px;
        a {
          text-decoration: none;
        }
        .logo {
          height: 44px;
          vertical-align: top;
          margin-right: 16px;
        }
        .title {
          font-size: 33px;
          color: @title-color;
          font-family: 'Myriad Pro', 'Helvetica Neue', Arial, Helvetica, sans-serif;
          font-weight: 600;
          position: relative;
          top: 2px;
        }
      }
      .desc {
        font-size: 14px;
        color: @text-color-second;
        margin-top: 12px;
        margin-bottom: 40px;
      }
    }
    .login{
      width: 368px;
      margin: 0 auto;
      @media screen and (max-width: 576px) {
        width: 95%;
      }
      @media screen and (max-width: 320px) {
        .captcha-button{
          font-size: 14px;
        }
      }
      .icon {
        font-size: 24px;
        color: @text-color-second;
        margin-left: 16px;
        vertical-align: middle;
        cursor: pointer;
        transition: color 0.3s;

        &:hover {
          color: @primary-color;
        }
      }
    }
    .codeimg{
      background-color: white;
    }
  }
</style>
