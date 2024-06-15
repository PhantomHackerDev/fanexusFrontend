<template>
  <button
    class="burger-button"
    :class="{ 'burger-button_toggled': toggled }"
    type="button"
  >
    <span></span>
  </button>
</template>
<script>
export default {
  props: {
    toggled: {
      type: Boolean
    }
  }
};
</script>
<style lang="scss" scoped>
.burger-button {
  display: block;
  width: 19px;
  height: 12px;
  position: relative;
  background: none;
  transition: var(--transition-default);
  &:focus {
    outline: none;
  }
  &:focus {
    span {
      background-color: var(--BG-button-primary-hover);
    }
    &:before,
    &:after {
      background-color: var(--BG-button-primary-hover);
    }
  }

  &:before,
  &:after,
  & span {
    position: absolute;
    height: 2px;
    width: 19px;
    top: 0;
    left: 0;
    content: '';
    border-radius: var(--border-radius);
    background-color: var(--color-white);
    transition: var(--transition-default);
  }

  &:after {
    top: 5px;
  }

  & span {
    top: 10px;
  }

  &_toggled {
    &:before {
      transform: rotate(45deg);
      left: 0px;
      top: 6px;
    }
    &:after {
      opacity: 0;
    }
    span {
      transform: rotate(-45deg);
      left: 0px;
      top: 6px;
    }
  }
}
</style>
