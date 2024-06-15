<template>
  <transition name="fade">
    <div class="flash-message">
      <div class="flash-message__container" :class="type"><slot /></div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    type: {
      type: String
    }
  }
};
</script>

<style lang="scss" scoped>
.flash-message {
  position: fixed;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  bottom: var(--element-margin-xl);
  display: flex;
  justify-content: center;
  z-index: var(--z-index-popup);

  &__container {
    border-radius: var(--border-radius);
    padding: var(--element-padding-s);
    border: var(--border-width-default) solid var(--border-success);
    background-color: var(--BG-blog-post);
    color: var(--text-primary);

    &.failure {
      border-color: var(--border-input-error);
    }
  }
}
</style>
