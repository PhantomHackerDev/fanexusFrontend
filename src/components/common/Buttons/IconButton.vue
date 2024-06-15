<template>
  <button class="icon-button" type="button" :aria-label="label" :title="label">
    <component :is="iconComponentName" class="icon-button__icon" />
  </button>
</template>
<script>
import PencilIcon from '~svg/pencil.svg';
import MagnifierIcon from '~svg/magnifier.svg';
import BorderedPencilIcon from '~svg/bordered-pencil.svg';
import CircleArrowTopIcon from '~svg/circle-arrow-top.svg';
export default {
  components: {
    PencilIcon,
    MagnifierIcon,
    BorderedPencilIcon,
    CircleArrowTopIcon
  },
  props: {
    icon: {
      type: String
    },
    label: {
      type: String
    }
  },
  computed: {
    iconComponentName() {
      return `${this.icon}-icon`;
    }
  }
};
</script>
<style lang="scss" scoped>
@import '@/assets/scss/common/_mixins';
.icon-button {
  background-color: transparent;
  border: none;
  padding: 0;
  transition: opacity var(--transition-default);
  outline: none;
  &:hover {
    opacity: 0.8;
  }
  &__icon {
    width: 100%;
    height: 100%;
  }
}
</style>
