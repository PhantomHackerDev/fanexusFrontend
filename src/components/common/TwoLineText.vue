<template>
  <div class="two-line-text">
    <div
      class="two-line-text__text-holder"
      :style="{ maxHeight: maxHeight + 'px' }"
      ref="textHolder"
    >
      <div class="two-line-text__text" ref="text" v-html="text"></div>
    </div>
    <div
      v-if="isMoreButtonVisible"
      class="two-line-text__more-button"
      @click="$emit('more-button-click')"
    >
      MORE
    </div>
  </div>
</template>

<script>
export default {
  name: 'two-line-text',
  props: {
    text: String
  },
  data() {
    return {
      maxHeight: 0,
      isMoreButtonVisible: false
    };
  },
  mounted() {
    this.updateParams();
    window.addEventListener('resize', this.updateParams);
  },
  destroyed() {
    window.removeEventListener('resize', this.updateParams);
  },
  methods: {
    /**
     * public
     */
    async updateParams() {
      const fontSize = getComputedStyle(this.$el).fontSize;
      this.maxHeight = Number(fontSize.replace('px', '')) * 2;
      await this.$nextTick();
      const textHolderHeight = this.$refs.textHolder.offsetHeight;
      const textHeight = this.$refs.text.offsetHeight;
      this.isMoreButtonVisible = textHeight > textHolderHeight;
    }
  }
};
</script>

<style lang="scss" scoped>
.two-line-text {
  position: relative;
  font-size: inherit;
  &__text-holder {
    font-size: inherit;
    overflow: hidden;
  }
  &__text {
    font-size: inherit;
  }
  &__more-button {
    position: absolute;
    bottom: 0;
    left: calc(100% + 5px);
    font-size: inherit;
    color: #9671a4;
  }
}
</style>
