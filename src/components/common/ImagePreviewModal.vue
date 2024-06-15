<template
  ><div class="image-popup" v-if="src">
    <div class="image-popup__wrapper">
      <img :src="src" alt="popup-image" />
      <button type="button" class="image-popup__close" @click="close"></button>
    </div></div
></template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  computed: {
    ...mapState({
      src: state => state.blogPost.imagePreviewSrc
    })
  },
  methods: {
    ...mapActions(['setImagePreviewSrc']),
    close() {
      this.setImagePreviewSrc(null);
    }
  }
};
</script>

<style lang="scss" scoped>
.image-popup {
  position: fixed;
  display: flex;
  z-index: var(--z-index-popup);
  padding: 50px 0;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  overflow: auto;
  background-color: var(--popup-overlay);

  &__wrapper {
    position: relative;
    max-width: 90%;
    margin: auto;
    display: block;
  }
  img {
    object-fit: cover;
    border: var(--border-width-thick) solid var(--border-button-secondary);
  }
  &__close {
    position: absolute;
    top: -15px;
    right: -10px;
    background: var(--border-button-secondary);
    border-radius: 50%;
    padding: var(--element-padding-xs);
    cursor: pointer;
    width: 25px;
    height: 25px;
    align-self: flex-start;
    transition: var(--transition-default);
    &:focus {
      outline: none;
    }
    &:hover {
      &:before,
      &:after {
        background-color: var(--color-main-600);
      }
    }

    &:before,
    &:after {
      position: absolute;
      content: '';
      top: 50%;
      left: 50%;
      width: 2px;
      height: 20px;
      background-color: var(--text-button-comment);
      border-radius: 2px;
    }
    &:before {
      transform: translate(-50%, -50%) rotate(45deg);
    }
    &:after {
      transform: translate(-50%, -50%) rotate(-45deg);
    }
  }
}
</style>
