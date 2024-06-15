<template
  ><div class="image-viewer" @mousemove="displayNavigation">
    <transition name="fade">
      <div class="image-viewer__top" v-if="showNavigation">
        <div></div>
        <div class="navigation">
          <span
            @click="toPreviousImage"
            v-if="currentImageIndex"
            class="navigation-container"
            ><previous-icon class="navigation-icon"/></span
          >Image {{ currentImageIndex + 1 }} of {{ images.length
          }}<span
            @click="toNextImage"
            v-if="currentImageIndex < images.length - 1"
            class="navigation-container"
            ><next-icon class="navigation-icon"
          /></span>
        </div>
        <div>
          <cross-icon class="navigation-icon close-icon" @click="close" />
        </div>
      </div>
    </transition>
    <div class="image-viewer__wrapper">
      <img
        @click="toNextImage"
        :src="currentImageSrc"
        alt="image in image viewer"
        :style="imageStyle"
      />
    </div></div
></template>

<script>
import PreviousIcon from '~svg/previous-icon.svg';
import NextIcon from '~svg/next-icon.svg';
import CrossIcon from '~svg/cross-icon.svg';
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
  components: {
    PreviousIcon,
    NextIcon,
    CrossIcon
  },
  data() {
    return {
      showNavigation: true,
      hideNavigationTime: 4000,
      hideNavigation: null
    };
  },
  computed: {
    ...mapState({
      images: state => state.imageViewer.images,
      currentImageSrc: state => state.imageViewer.currentImageSrc
    }),
    ...mapGetters(['currentImageIndex']),
    imageStyle() {
      return (
        this.currentImageIndex < this.images.length - 1 && { cursor: 'pointer' }
      );
    }
  },
  methods: {
    ...mapActions(['toNextImage', 'toPreviousImage', 'setCurrentImage']),
    close() {
      this.setCurrentImage(null);
    },
    displayNavigation() {
      this.showNavigation = true;
      clearTimeout(this.hideNavigation);
      this.hideNavigation = setTimeout(() => {
        this.showNavigation = false;
      }, this.hideNavigationTime);
    }
  },
  mounted() {
    this.displayNavigation();
  }
};
</script>

<style lang="scss" scoped>
.image-viewer {
  position: fixed;
  display: flex;
  z-index: var(--z-index-popup);
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: var(--popup-overlay);

  &__top {
    position: absolute;
    width: 100%;
    top: 0;
    display: flex;
    justify-content: space-between;
    padding: var(--element-padding-m) 0;
    background: var(--popup-overlay);
    z-index: var(--z-index-popup-overlay);

    .navigation {
      color: var(--color-white);
    }
  }
  &__wrapper {
    position: relative;
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
  }
  img {
    object-fit: cover;
    max-width: 100%;
    max-height: 100%;
  }
}

.navigation-container {
  vertical-align: middle;
}
.navigation-icon {
  stroke-width: 5px;
  stroke: var(--color-white);
  width: 20px;
  height: 20px;
  cursor: pointer;
}
.close-icon {
  margin-right: 15px;
}
</style>
