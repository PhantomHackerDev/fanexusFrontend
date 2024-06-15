<template>
  <transition name="fade" appear>
    <div
      class="modal-overlay"
      :class="{ 'has-overflow': hasOverflow }"
      v-if="settings.show"
      tabindex="0"
    >
      <div ref="modal" class="modal">
        <slot name="modal-image" />
        <div class="modal-content">
          <header class="modal-header">
            <slot name="header" v-if="!settings.hideHeader">
              <h2 class="modal-header__title" v-if="settings.title">
                {{ settings.title }}
              </h2>
            </slot>
            <button
              type="button"
              class="modal-header-btn__close"
              @click="close"
            ></button>
          </header>
          <section class="modal-body">
            <slot name="body"></slot>
          </section>
          <footer
            class="modal-footer"
            v-if="settings.dismissText || settings.actionText"
          >
            <slot name="footer">
              <div class="footer-wrapper-btns">
                <form-button
                  :text="settings.dismissText"
                  type="button"
                  v-if="settings.dismissText"
                  @click.native.stop="close"
                  class="modal-footer__btn"
                />
                <form-button
                  :text="settings.actionText"
                  type="submit"
                  v-if="settings.actionText"
                  :disabled="actionDisabled"
                  @click.native.stop="save"
                  class="modal-footer__btn form-button"
                />
              </div>
            </slot>
          </footer>
        </div>
        <div class="modal-tags" v-if="tags" @click.stop>
          <h3 class="modal-tags__title">Favourite tags</h3>
          <form-input
            class="input-search"
            type="search"
            placeholder="Search"
            name="search-tag"
          />
          <tags-list :list="tags" />
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import { APP_TITLE } from '@/services/config';
import resizeMixin from '@/mixins/resize.mixin';
import { disableScroll, enableScroll } from '@/utils/scrollLock';
import FormButton from '~common/Buttons/FormButton';
import FormInput from './Fields/FormInput';
import TagsList from './TagsList';

export default {
  mixins: [resizeMixin],
  props: {
    settings: {
      type: Object,
      default() {
        return {
          title: APP_TITLE,
          hideHeader: false,
          show: false,
          auth: false,
          dismissText: null,
          actionText: null
        };
      },
      required: true
    },
    closeOnSave: {
      type: Boolean,
      default: true
    },
    actionDisabled: {
      type: Boolean,
      default: false
    },
    tags: {
      type: Array
    }
  },
  components: {
    FormButton,
    FormInput,
    TagsList
  },
  data() {
    return {
      resizeCounter: 1
    };
  },
  computed: {
    hasOverflow() {
      return (
        this.resizeCounter && this.$refs.modal?.offsetHeight > this.windowHeight
      );
    }
  },
  methods: {
    close() {
      this.$emit('close');
      this.settings.show = false;
    },
    save() {
      /*@TODO add save method and if we need 'close' add it */
      this.$emit('save');
      if (this.closeOnSave) {
        this.close(false);
      }
    },
    updateBodyScrollAvailability() {
      if (this.settings.show) {
        disableScroll();
      } else {
        enableScroll();
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.resizeObserver(this.$refs.modal);
      window.addEventListener('resize', this.onResize);
      this.onResize();
    });
    this.updateBodyScrollAvailability();
  },
  beforeDestroy() {
    this.updateBodyScrollAvailability();
    window.removeEventListener('resize', this.onResize);
  },
  watch: {
    settings: {
      deep: true,
      handler() {
        this.updateBodyScrollAvailability();
      }
    },
    '$route.name'() {
      this.close();
    }
  }
};
</script>
<style lang="scss" scoped>
@import '@/assets/scss/common/_mixins';
.modal {
  overflow-x: auto;
  display: flex;
  position: relative;
  @include tablet {
    flex-direction: column;
    align-items: center;
    padding: var(--element-padding-l) 0;
  }
  @include mobile {
    width: 100%;
    padding: 0;
  }
  &-overlay {
    position: fixed;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    background-color: var(--popup-overlay);
    overflow: auto;
    z-index: var(--z-index-popup);
    @include mobile {
      width: 100%;
      height: 100%;
    }

    &.has-overflow {
      align-items: flex-start;
    }
  }
  &-content {
    flex: 1;
    margin: 0 var(--element-margin-xxl);
    border-radius: var(--border-radius);
    overflow: visible;
    max-width: 100%;
    @include tablet {
      order: 2;
    }
    @include mobile {
      width: 100%;
      margin: 0;
    }
  }
  &-body {
    background: var(--BG-primary);
    padding: var(--element-padding-xl) var(--element-padding-l);
  }
  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: var(--BG-modal-window);
    padding: var(--element-padding-l);
    position: relative;
    box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.15);
    z-index: var(--z-index-1);
    &__title {
      font-family: 'OpenSans-Bold', sans-serif;
      font-size: var(--size-title);
      color: var(--text-primary);
      margin-bottom: 0;
    }
    ::v-deep &-btn {
      &__close {
        background: unset;
        cursor: pointer;
        width: 20px;
        height: 20px;
        align-self: flex-start;
        position: absolute;
        top: 20px;
        right: 20px;
        @include mobile {
          top: 10px;
          right: 10px;
        }
        &:focus {
          outline: none;
          &:before,
          &:after {
            background-color: var(--text-button-hover);
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
          background-color: var(--text-primary);
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
  }
  &-footer {
    background: var(--BG-modal-window);
    padding: var(--element-margin-l) 0;
    display: flex;
    justify-content: center;
    box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.15);
    &__btn {
      width: 100px;
      &:first-child {
        margin-right: var(--element-margin-s);
      }
    }
  }

  &-tags {
    position: absolute;
    left: calc(50% + 290px + var(--element-margin-m));
    top: var(--element-margin-m);
    background-color: var(--BG-blog-post);
    width: var(--width-small);
    z-index: var(--z-index-popup);
    border-radius: var(--border-radius);
    padding: var(--element-padding-m);
    @include tablet {
      position: static;
      margin-bottom: var(--element-margin-l);
      width: 100%;
    }
    @include mobile {
      margin-bottom: 0;
    }

    &__title {
      margin-bottom: var(--element-margin-m);
      color: var(--text-primary);
      font-size: var(--size-title);
      font-family: 'OpenSans-Bold', sans-serif;
    }

    ::v-deep {
      .input-search {
        margin-bottom: var(--element-margin-m);
      }
      .tags-list {
        padding: 0;
        &__item {
          margin-bottom: var(--element-margin-s);
        }
      }
    }
  }
}
.modal-overlay {
  &--centered {
    overflow: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    .modal-content {
      width: var(--width-medium);
      @include mobile {
        width: 100%;
      }
    }
    .modal {
      overflow: visible;
    }
  }
}
</style>
