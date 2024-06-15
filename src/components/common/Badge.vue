<template>
  <span class="badge">{{ info }}</span>
</template>

<script>
export default {
  name: 'badge',
  props: {
    info: {
      required: true
    }
  }
};
</script>

<style lang="scss" scoped>
.badge {
  height: 20px;
  font-size: var(--size-small);
  border-radius: 4px;
  background-color: var(--color-white);
  color: var(--text-button-primary);
  padding: calc(var(--button-padding-m) / 3);
  font-family: 'OpenSans-Bold', sans-serif;
}
</style>
