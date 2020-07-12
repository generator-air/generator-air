<template>
  <div class="p-log">
    <h3 class="header-title">日志示例</h3>
    <div>
      <el-switch
        v-model="isOpened"
        active-color="#13ce66"
        active-text="开启"
        inactive-text="关闭"
        @change="handleSwitch"
      />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isOpened: false,
      interval: '',
    };
  },
  methods: {
    /* 日志上报系统 aegis，详见 aegis.ivweb.io */
    handleSwitch(value) {
      if (value) {
        /* 日志监听结果在日志/项目实时日志中选择开始监听 */
        this.interval = setInterval(() => {
          this.$bjReport.report('badjs手动日志上报', value);
          // 监控当前页面
          this.$bjReport.logI('badjs普通日志上报', value);
        }, 1000);
      } else {
        clearInterval(this.interval);
      }
    },
  },
};
</script>
