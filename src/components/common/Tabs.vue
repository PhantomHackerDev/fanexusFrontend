<template>
  <div class="tabs" :class="{ breadcrumbs: isBreadcrumbs }">
    <ul class="nav-tabs">
      <li
        v-for="(tab, index) in tabs"
        :key="`${tab.title}-${index}`"
        :class="{ active: index === active }"
      >
        <button type="button" @click="selectTab(index)" ref="button">
          {{ `${tab.title}${tab.count ? ` (${tab.count})` : ''}` }}
          <template v-if="tab.number">({{ tab.number }})</template>
        </button>
      </li>
      <li v-if="additionalOptions.length">
        <dots-button
          @block="$emit('block')"
          @unblock="$emit('unblock')"
          @follow="$emit('follow')"
          @unfollow="$emit('unfollow')"
          @join="$emit('join')"
          @leave="$emit('leave')"
          @edit="$emit('edit')"
          :options="additionalOptions"
        />
      </li>
    </ul>
    <slot />
  </div>
</template>

<script>
import DotsButton from '~common/Buttons/DotsButton';

export default {
  props: {
    tabs: {
      type: Array,
      required: true,
      default: () => [{}]
    },
    active: {
      type: Number,
      default: 0
    },
    isBreadcrumbs: {
      type: Boolean,
      default: false
    },
    additionalOptions: {
      type: Array,
      default: () => []
    }
  },
  components: {
    DotsButton
  },
  methods: {
    setAutofocus() {
      const ref = this.$refs.button;

      if (ref && ref[0]) {
        ref[0].focus();
      }
    },
    selectTab(index) {
      this.$emit('select-tab', index);
    }
  },
  mounted() {
    this.setAutofocus();
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/common/_mixins';
/*@TODO revise*/
.tabs .nav-tabs {
  margin-bottom: 0;
  height: 60px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  list-style: none;
  > li {
    flex: 1 1 0px;
    border-bottom: 1px solid;
    border-color: transparent;
    text-align: center;
    margin-left: var(--element-margin-xl);
    &:first-child {
      margin-left: 0;
    }
    button {
      background: unset;
      font-family: 'OpenSans-Bold';
      font-size: var(--size-button);
      color: var(--color-main-500);
      white-space: nowrap;
      height: 100%;
      width: 100%;
      text-transform: uppercase;
      &:focus {
        color: var(--color-main-600);
        outline: none;
      }
    }
    &.active {
      border-color: var(--BG-button-secondary);
      > button {
        color: var(--BG-button-secondary);
      }
    }
  }
}

.tabs.breadcrumbs {
  .nav-tabs {
    li {
      border: none;
      &:first-child {
        position: relative;
        &:after {
          content: '';
          height: 20px;
          width: 2px;
          background-color: var(--tab-normal);
          position: absolute;
          top: 20px;
          right: -15px;
          @include tablet {
            right: -10px;
          }
        }
      }
      &:only-child {
        &:after {
          display: none;
        }
      }
      &.active {
        > button {
          color: var(--BG-button-secondary);
        }
      }
    }
    button {
      text-transform: capitalize;
      font-size: var(--size-activity);
      color: var(--tab-normal);
      @include mobile {
        font-size: var(--size-regular);
      }
    }
  }
}
</style>
