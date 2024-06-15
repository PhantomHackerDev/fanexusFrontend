<template>
  <div class="show-all">
    <button class="show-all__btn">
      {{ text }}<keyboard-arrow-left class="show-all__btn-arrow" />
    </button>
  </div>
</template>

<script>
import KeyboardArrowLeft from '~svg/keyboardarrow-left.svg';
export default {
  components: {
    KeyboardArrowLeft
  },
  props: {
    text: {
      type: String,
      required: true
    }
  }
};
</script>

<style lang="scss" scoped>
.show-all {
  &__btn:hover {
    color: var(--color-main-800);
    .show-all__btn-arrow {
      fill: var(--color-main-800);
    }
  }

  &__btn {
    font-family: 'OpenSans-Regular', sans-serif;
    font-size: 11px;
    text-transform: uppercase;
    background-color: transparent;
    color: var(--color-main-600);
    transition: var(--transition-default);
    outline: none;
    display: flex;

    &-arrow {
      transform: rotate(180deg);
      margin: 0 var(--element-margin-s);
      fill: var(--color-main-600);
      transition: var(--transition-default);
    }
  }
}
</style>
