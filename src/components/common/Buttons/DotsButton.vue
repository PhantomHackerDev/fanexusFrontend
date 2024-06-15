<template>
  <button type="button" class="dots-button" @click.stop="toggleDropdown">
    <dots-icon class="dots-button__icon" :class="{ active: dropdownShow }" />
    <action-dropdown
      :isAddingUser="isAddingUser"
      @add="$emit('add')"
      @delete="$emit('delete')"
      @edit="$emit('edit')"
      @block="$emit('block')"
      @unblock="$emit('unblock')"
      @follow="$emit('follow')"
      @unfollow="$emit('unfollow')"
      @join="$emit('join')"
      @leave="$emit('leave')"
      @report="$emit('report')"
      @close="toggleDropdown(false)"
      v-if="dropdownShow"
      :options="options"
    />
  </button>
</template>
<script>
import DotsIcon from '~svg/dots-icon.svg';
import ActionDropdown from '~common/ActionDropdown';
import ClickOutside from 'vue-click-outside';

export default {
  components: {
    DotsIcon,
    ActionDropdown
  },
  props: {
    isAddingUser: {
      type: Boolean,
      default: false
    },
    options: {
      type: Array
    }
  },
  data() {
    return {
      dropdownShow: false
    };
  },
  directives: {
    ClickOutside
  },
  methods: {
    toggleDropdown(isToggle = true) {
      this.dropdownShow = isToggle ? !this.dropdownShow : false;
    }
  }
};
</script>
<style lang="scss" scoped>
.dots-button {
  position: relative;
  outline: none;
  background: transparent;

  &__icon {
    fill: var(--text-primary);
    width: 20px;
    height: 13px;
  }
}
.active {
  fill: var(--BG-button-pagination-active);
}
</style>
