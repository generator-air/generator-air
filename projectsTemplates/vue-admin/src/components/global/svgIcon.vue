<template>
  <svg class="svg-icon">
    <use :xlink:href="'#' + name"></use>
  </svg>
</template>

<script>
export default {
  name: 'svg-icon',
  props: {
    name: {
      type: String,
      required: true,
    },
  },
};
</script>
