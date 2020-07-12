<template lang="pug">
svg.svg-icon
	use(:xlink:href="'#' + name")
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
