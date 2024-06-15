<template>
  <button class="add-button" type="button">
    <span class="add-button__plus">+</span>{{ text }}
  </button>
</template>
<script>
export default {
  props: {
    text: {
      type: String
    }
  }
};
</script>
<style lang="scss" scoped>
.add-button {
  background-color: transparent;
  border: var(--border-width-thin) solid var(--text-primary);
  border-radius: var(--border-radius);
  font-family: 'OpenSans-Bold', sans-serif;
  font-size: var(--size-regular);
  transition: var(--transition-default);
  color: var(--text-primary);
  display: flex;
  justify-content: center;
  align-items: center;

  &__plus {
    font-size: 26px;
    font-family: 'OpenSans-Regular', sans-serif;
    margin-right: var(--element-padding-s);
  }

  &:hover {
    border-color: var(--border-button-secondary-hover);
    color: var(--border-button-secondary-hover);
  }

  &:focus {
    outline: none;
    border-color: var(--border-button-secondary-hover);
    color: var(--border-button-secondary-hover);
  }
}
</style>
