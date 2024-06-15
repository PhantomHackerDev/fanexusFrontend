<template>
  <img v-if="file" :src="file" :class="size" :alt="alt" />
  <div v-else :class="size"></div>
</template>
<script>
const sizePropTypes = ['sm', 'md', 'xl'];

export default {
  props: {
    file: {
      type: undefined
    },
    size: {
      type: String,
      default: sizePropTypes[0],
      validator: value => sizePropTypes.includes(value)
    },
    alt: {
      type: String,
      default: 'avatar'
    }
  }
};
</script>
<style lang="scss" scoped>
@import '@/assets/scss/common/_mixins';
img {
  display: block;
  object-fit: cover;
  border-radius: var(--border-radius);
}
.sm {
  width: 40px;
  height: 40px;
}
.md {
  width: 50px;
  height: 50px;
}
.xl {
  width: var(--width-medium-small);
  max-width: 100%;
  height: 250px;

  @include tablet {
    height: var(--width-medium-small);
  }
}
</style>
