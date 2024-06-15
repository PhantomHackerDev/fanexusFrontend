<template>
  <div
    class="expandable"
    :class="{ shrinked: !expanded && expandable && height > heightMax }"
  >
    <div class="expandable__content" ref="content">
      <slot />
      <button
        v-if="expandable && height > heightMax"
        type="button"
        @click="expanded = !expanded"
        class="expandable__expand-button"
      >
        {{ expanded ? 'Shrink' : 'Expand' }} {{ contentLabel }}
      </button>
    </div>
  </div>
</template>

<script>
import resizeMixin from '@/mixins/resize.mixin';

export default {
  props: {
    contentLabel: {
      type: String,
      required: true
    },
    expandable: {
      type: Boolean,
      default: true
    }
  },
  mixins: [resizeMixin],
  data() {
    return {
      expanded: false,
      height: 0,
      heightMax: 450
    };
  },
  watch: {
    resizeCounter: {
      handler(value) {
        const { content } = this.$refs;

        if (content) {
          this.height = content.clientHeight;
        }
        this.$nextTick(() => {
          this.$emit('resized', value);
        });
      },
      immediate: true
    }
  },
  mounted() {
    this.resizeObserver(this.$refs.content);
  }
};
</script>

<style lang="scss" scoped>
.expandable {
  position: relative;
  max-height: unset;
  &.shrinked {
    max-height: 300px;
    overflow: hidden;
    .expandable__expand-button {
      position: absolute;
    }
  }

  &__expand-button {
    width: 100%;
    padding: var(--element-padding-m) 0;
    text-transform: uppercase;
    bottom: 0;
    left: 0;
    background: linear-gradient(to top, var(--BG-expand));
    color: var(--text-button);
    font-size: var(--size-regular);
    font-weight: 600;
    transition: var(--transition-default);
    &:hover {
      color: var(--text-button-hover);
    }
    &:focus {
      outline: none;
    }
  }
}
</style>
