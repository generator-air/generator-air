<template>
  <router-link class="logo" to="/">
    <div class="logo-img"><img src="@/assets/image/logo.png" alt="" /></div>
    <div class="name">{{ title }}</div>
  </router-link>
</template>

<script>
export default {
  name: 'logo',
  props: ['title'],
};
</script>

<style lang="less">
@import '~css/color';

.logo {
  margin: 42px 0;
  display: block;
  text-decoration: none;
  text-align: center;
  .logo-img {
    width: 80px;
    height: 80px;
    margin: 0 auto;
    border-radius: 100%;
    overflow: hidden;
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .name {
    color: white;
    margin-top: 23px;
    font-size: 14px;
  }
}
</style>
