<template>
  <transition name="back-to-top">
    <icon-button
      v-if="scrollTop > 150"
      class="back-to-top"
      type="button"
      icon="circle-arrow-top"
      label="Back to top"
    />
  </transition>
</template>
<script>
import IconButton from '@/components/common/Buttons/IconButton.vue';
export default {
  data() {
    return {
      scrollTop: 0
    };
  },
  components: {
    IconButton
  },
  created() {
    window.addEventListener('scroll', this.handleScroll);
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    handleScroll() {
      this.scrollTop = window.scrollY;
    }
  }
};
</script>
<style lang="scss" scoped>
.back-to-top {
  position: fixed;
  bottom: 15px;
  left: 15px;
  width: 30px;
  height: 30px;
  z-index: 1;
  &-enter,
  &-leave-to {
    opacity: 0;
    transform: translateY(30px);
  }
  &-enter-active,
  &-leave-active {
    transition: opacity var(--transition-default),
      transform var(--transition-default);
  }
}
</style>
