<template>
  <div v-if="hasResponse">
    <slot />
  </div>
  <div class="waiting" v-else>
    Waiting for response from server...
  </div>
</template>

<script>
export default {
  props: {
    hasResponse: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang="scss" scoped>
.waiting {
  padding: var(--element-padding-l);
  color: var(--text-primary);
  text-align: center;
}
</style>
