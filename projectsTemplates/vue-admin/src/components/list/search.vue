<template>
  <div class="v-search">
    <div class="search-label">{{ label }}</div>
    <div class="el-input" :class="{ 'is-empty': empty }">
      <input
        type="text"
        class="el-input__inner"
        v-model="inputValue"
        autocomplete="off"
        @keyup.13="search"
        :placeholder="placeholder"
      />
      <i class="el-input__icon el-icon-search is-clickable" @click="search" />
      <i class="el-input__icon el-icon-close" @click="clear" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    channel: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      default: 'kw',
    },
    label: {
      type: String,
      default: '请搜索',
    },
    value: String,
    placeholder: String,
  },
  data() {
    return {
      logger: 'components/list/fsearch',
      inputValue: '',
    };
  },
  computed: {
    empty() {
      return !this.inputValue;
    },
  },
  watch: {
    value(val) {
      this.inputValue = val;
    },
  },
  methods: {
    search() {
      let value = this.inputValue;
      if (value) {
        value = value.trim();
        this.inputValue = value;
        this.$emit('search', value);
        this.setKeyword(value);
      } else {
        this.clear();
      }
    },
    clear() {
      this.inputValue = '';
      this.$emit('clear');
      this.setKeyword('');
    },
    setKeyword(keyword) {
      let name = this.name;
      let query = {};
      query.page = 1;
      query[name] = keyword;
      this.setQuery(query);
    },
    setQuery(query) {
      query = Object.assign({}, this.$route.query, query);
      this.$router.push({
        query,
      });
    },
  },
  mounted() {
    this.inputValue = this.value;
  },
};
</script>

<style lang="less">
@import '../../assets/css/color';

.v-search {
  display: inline-block;
  vertical-align: middle;
  width: 300px;
  margin-right: 10px;
  .search-label {
    display: inline-block;
    color: @default-color;
  }
  .el-input {
    width: 70%;
  }
  input {
    // border-radius: 100px
    box-shadow: 0 0 20px 0 rgba(102, 126, 164, 0.05);
  }
  .el-input__icon {
    position: absolute;
    width: 40px;
    color: #c5c5da;
  }
  .el-icon-search {
    left: 0;
    font-size: 16px;
    cursor: pointer;
  }
  .el-input__inner {
    padding: 0 40px;
    line-height: 40px;
  }
  .el-icon-close {
    right: 0;
    font-size: 12px;
  }
  .el-input.is-active .el-input__inner,
  .el-input__inner:focus {
    border-color: @theme-color;
  }
  .is-empty {
    .el-icon-close {
      display: none;
    }
  }
}
</style>
