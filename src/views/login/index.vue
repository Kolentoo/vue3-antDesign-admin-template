<template>
  <div class="login-container">
    <a-row>
      <a-col :xs="0" :md="0" :sm="12" :lg="14" :xl="14"></a-col>
      <a-col :xs="24" :sm="24" :md="12" :lg="10" :xl="8">
        
        <div class="login-container-form">
          <div class="login-container-hello"></div>
          <div class="login-container-title">欢迎登录 {{ title }}</div>
          <a-form :model="form" @finish="handleSubmit" @submit.prevent :rules="loginRules" @finishFailed="onFinishFailed">

            <a-form-item name="username">
              <a-input v-model:value="form.username" placeholder="请输入用户名">
                <template v-slot:prefix>
                  <UserOutlined style="color: rgba(0, 0, 0, 0.25)" />
                </template>
              </a-input>
            </a-form-item>

            <a-form-item name="password">
              <a-input
                v-model:value="form.password"
                type="password"
                placeholder="请输入密码" >
                <template v-slot:prefix>
                  <LockOutlined style="color: rgba(0, 0, 0, 0.25)" />
                </template>
              </a-input>
            </a-form-item>

            <a-form-item class="code-box" name="captchaId">
              <a-input
                v-model:value="form.captchaId"
                type="text"
                maxlength="4"
                placeholder="请输入验证码" >
                <template v-slot:prefix>
                  <verified-outlined style="color: rgba(0, 0, 0, 0.25)" />
                </template>
              </a-input>
              <div class="pic-code">
                <img v-if="showPic" class="code" :src="codeSrc" @click="getCodeURL" alt="" />
              </div>

            </a-form-item>
            
            <a-form-item class="login-btn">
              <a-button
                type="primary"
                html-type="submit">
                登录
              </a-button>
            </a-form-item>
          </a-form>
        </div>
      </a-col>
    </a-row>
  </div>
</template>
<script setup>
  import {reactive,ref,computed,onMounted} from 'vue';
  import {useStore} from 'vuex';
  import { UserOutlined, LockOutlined,VerifiedOutlined } from '@ant-design/icons-vue'
  import { codeURL } from '@/api/user'
  import { useRoute, useRouter } from 'vue-router'
  import store from '@/store'

  const route = useRoute()
  const router = useRouter()
  console.log('route',route)
  console.log('router',router);

  // 登录表单数据
  const form = reactive({
    username:'',
    password:'',
    captchaId:''
  })

  // form.username = '15026753453';
  // form.password = '123456'
  const codeSrc = ref('');
  const showPic = ref('');

  // 获取用户信息
  const logo = ref('');
  const title = ref('');
  console.log('store',store);
  title.value = store.getters['settings/title'];
  logo.value = store.getters['settings/logo'];

  // 表单验证
  let validateUsername = async (_rule, value) => {
    if (value === '') {
      return Promise.reject('请输入用户名');
    } else {
      return Promise.resolve();
    }
  };
  let validatePsd = async (_rule, value) => {
    if (value === '') {
      return Promise.reject('请输入密码');
    } else {
      if(value.length<6){
        return Promise.reject('密码不能少于6位');
      }
      return Promise.resolve();
    }
  };
  let validateCaptchaId = async (_rule, value) => {
    if (value === '') {
      return Promise.reject('请输入验证码');
    } else {
      return Promise.resolve();
    }
  };

  const loginRules = {
    username: [{
      required: true,
      validator: validateUsername,
      trigger: 'change',
    }],
    password: [{
      validator: validatePsd,
      trigger: 'change',
    }],
    captchaId: [{
      validator: validateCaptchaId,
      trigger: 'change',
    }],
  };

  // 生命周期
  onMounted(()=>{
    getCodeURL();
  })

  const handleSubmit = async() =>{
    // 执行登录
    console.log('执行登录');
    form.password = new Buffer(form.password).toString('base64');
    await store.dispatch('user/login',form);
    // 路由跳转
    router.push('/')
  }

  const onFinishFailed = ()=>{
    console.log('验证失败');
  }

  const randomCaptchaId = () =>{
    // 生成随机码
    return Math.floor(Math.random() * 999999)
  }

  const getCodeURL = async() => {
    // 获取验证码图片
    showPic.value=false;
    let captchaId = randomCaptchaId()
    let res = await codeURL({ captchaId })
    codeSrc.value = `data:image/png;base64,${res}`
    showPic.value=true;
  }
  
</script>
<style lang="less">
  .login-container {
    width: 100%;
    height: 100vh;
    background: url('~@/assets/login_images/login_background.png');
    background-size: cover;
    &-form {
      width: calc(75%);
      padding: 6vh;
      margin-top: calc((100vh - 480px) / 2);
      margin-right: 20px;
      margin-left: 20px;

      background: #FFFFFF;
      box-shadow: 0px 1px 10px 0px rgba(217,222,233,0.7);
      border-radius: 12px;
    }
    &-hello {
      font-size: 32px;
      color: #484F5E;
    }
    &-title {
      margin-bottom: 30px;
      font-size: 24px;
      color: #484F5E;
      text-align: center;
      font-weight: bold;
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

  .login-btn {margin-top: 50px;}
</style>
