<template lang="pug">
	.p-login
		.bg-form
			.login-title
				.logo
					img(src="../assets/image/logo.png")
				.title 后台管理系统
			el-form.login-form(ref="form" :model="form" :rules="rules" label-width="80px" @keyup.enter.native="submit")
				el-form-item(prop="userName")
					el-input(v-model="form.userName" placeholder="请输入用户名" prop="userName")
				el-form-item(prop="password")
					el-input(v-model="form.password" placeholder="请输入密码" type="password")
				el-form-item(prop="captcha")
					el-input.captcha-input(v-model="form.captcha" placeholder="请输入验证码")
					img.captcha-img(:src="captchaSrc" @click="getCaptcha" alt="图像未找到")
				el-form-item.form-btn
					el-button(type="primary" @click="submit") 登 录
</template>

<script>
import $api from '@/model/api';

export default {
  data() {
    return {
      captchaId: '',
      captchaSrc: '',
      form: {
        userName: '',
        password: '',
        captcha_id: '',
        captcha: '',
      },
      rules: {
        userName: [
          { required: true, message: '请输入用户名', trigger: 'change' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'change' },
        ],
        captcha: [
          { required: true, message: '请输入验证码', trigger: 'change' },
        ],
      },
    };
  },
  methods: {
    submit() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          // 调登录接口
          this.login();
        } else {
          this.$message.error('表单验证未通过');
        }
      });
    },
    async login() {
      const rs = await this.$post($api.login, this.form);
      if (rs) {
        // 重新加载
        location.reload();
      } else {
        this.$message.error('请输入正确的用户名和密码');
        // 登录失败，清空验证码输入框，重新获取验证码
        this.form.captcha = '';
        this.getCaptcha();
      }
    },
    async getCaptcha() {
      const rs = await this.$get($api.getCaptcha);
      if (rs) {
        this.form.captcha_id = rs.captcha_id;
        this.captchaSrc = `data:image/png;base64,${rs.image}`;
      }
    },
  },
  mounted() {
    this.getCaptcha();
  },
};
</script>

<style lang="less">
.p-login {
  height: 100%;
  .bg-form {
    width: 50%;
    margin: 100px auto;
    background-color: #f1f1f1;
    padding-bottom: 20px;
  }
  .login-title {
    text-align: center;
  }
  .logo,
  .title {
    display: inline-block;
    vertical-align: middle;
  }
  .logo {
    width: 100px;
    height: 100px;
    background-color: transparent;
    img {
      width: 100%;
    }
  }
  .login-form {
    width: 80%;
  }
  .captcha-input {
    width: 70%;
  }
  .captcha-img {
    width: 30%;
    margin-left: 20px;
  }
  .form-btn {
    text-align: center;
  }
}
</style>
