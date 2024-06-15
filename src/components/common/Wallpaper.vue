<template>
  <div class="wallpaper">
    <img v-if="src" :src="src" :alt="alt" class="wallpaper__image" />
  </div>
</template>
<script>
export default {
  props: {
    src: {
      type: String
    },
    alt: {
      type: String,
      default: 'wallpaper'
    }
  }
};
</script>
<style scoped lang="scss">
.wallpaper {
  height: var(--wallpaper-height);

  &__image {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
