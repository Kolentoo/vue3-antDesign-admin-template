<template>
  <div class="login-container">
    <a-row>
      <a-col :xs="0" :md="0" :sm="12" :lg="14" :xl="16"></a-col>
      <a-col :xs="24" :sm="24" :md="12" :lg="10" :xl="6">
        
        <div class="login-container-form">
          <div class="login-container-hello">hello!</div>
          <div class="login-container-title">欢迎来到 {{ title }}</div>
          <a-form :model="form" @submit="handleSubmit" @submit.prevent>
            <a-form-item>
              <a-input v-model:value="form.username" placeholder="请输入用户名">
                <template v-slot:prefix>
                  <UserOutlined style="color: rgba(0, 0, 0, 0.25)" />
                </template>
              </a-input>
            </a-form-item>
            <a-form-item>
              <a-input
                v-model:value="form.password"
                type="password"
                placeholder="请输入密码"
              >
                <template v-slot:prefix>
                  <LockOutlined style="color: rgba(0, 0, 0, 0.25)" />
                </template>
              </a-input>
              
            </a-form-item>
            <a-form-item class="code-box">

              <a-input
                v-model:value="form.captchaId"
                type="text"
                placeholder="请输入验证码"
              >
                <template v-slot:prefix>
                  <verified-outlined style="color: rgba(0, 0, 0, 0.25)" />
                </template>
              </a-input>
              <div class="pic-code">
                <img v-if="showPic" class="code" :src="codeURL" @click="getCodeURL" alt="" />
              </div>

            </a-form-item>
            
            <a-form-item>
              <a-button
                type="primary"
                html-type="submit"
                :disabled="form.username === '' || form.password === ''"
              >
                登录
              </a-button>
            </a-form-item>
          </a-form>
        </div>
      </a-col>
    </a-row>
  </div>
</template>
<script>
  import { dependencies, devDependencies } from '*/package.json'
  import { mapActions, mapGetters } from 'vuex'
  import { UserOutlined, LockOutlined,VerifiedOutlined } from '@ant-design/icons-vue'
  import { codeURL } from '@/api/user'

  export default {
    name: 'Login',
    components: {
      UserOutlined,
      LockOutlined,
      VerifiedOutlined,
    },
    data() {
      return {
        form: {
          username: '',
          password: '',
          captchaId:''
        },
        redirect: undefined,
        dependencies: dependencies,
        devDependencies: devDependencies,
        codeUrl:'',
        showPic:false,
      }
    },
    computed: {
      ...mapGetters({
        logo: 'settings/logo',
        title: 'settings/title',
      }),
    },
    watch: {
      $route: {
        handler(route) {
          this.redirect = (route.query && route.query.redirect) || '/'
        },
        immediate: true,
      },
    },
    created(){
      this.getCodeURL();
    },  
    mounted() {
      this.form.username='15026753453';
      this.form.password='123456'
    },
    methods: {
      ...mapActions({
        login: 'user/login',
      }),
      handleRoute() {
        // 路由控制
        return this.redirect === '/404' || this.redirect === '/403'
          ? '/'
          : this.redirect
      },
      async handleSubmit(){
        //  执行登录
        this.form.password = new Buffer(this.form.password).toString('base64');
        await this.login(this.form);
        await this.$router.push(this.handleRoute())
        // this.$router.push('/')
      },
      randomCaptchaId() {
        // 生成随机码
        return Math.floor(Math.random() * 999999)
      },
      async getCodeURL() {
        // 获取验证码图片
        this.showPic=false;
        let captchaId = this.randomCaptchaId()
        let res = await codeURL({ captchaId })
        this.codeURL = `data:image/png;base64,${res}`
        this.showPic=true;
      },
    },
  }
</script>
<style lang="less">
  .login-container {
    width: 100%;
    height: 100vh;
    background: url('~@/assets/login_images/login_background.png');
    background-size: cover;
    &-form {
      width: calc(100% - 40px);
      // height: 380px;
      padding: 4vh;
      margin-top: calc((100vh - 480px) / 2);
      margin-right: 20px;
      margin-left: 20px;
      background: url('~@/assets/login_images/login_form.png');
      background-size: 100% 100%;
      border-radius: 10px;
      box-shadow: 0 2px 8px 0 rgba(7, 17, 27, 0.06);
    }
    &-hello {
      font-size: 32px;
      color: #fff;
    }
    &-title {
      margin-bottom: 30px;
      font-size: 20px;
      color: #fff;
    }
    &-tips {
      position: fixed;
      bottom: @vab-margin;
      width: 100%;
      height: 40px;
      color: rgba(255, 255, 255, 0.856);
      text-align: center;
    }
    .ant-col {
      width: 100%;
      padding: 0 10px 0 10px;
    }
    .ant-input {
      height: 35px;
    }
    .ant-btn {
      width: 100%;
      height: 45px;
      border-radius: 99px;
    }
  }

  .code-box {
    position: relative;
  }
  .pic-code {
    position: absolute;
    top:3px; right: 3px;
    z-index:10;
    cursor:pointer;
  }
</style>
