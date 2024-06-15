<template>
  <div
    class="addImage"
    :class="{
      hide: type === blogImageTypes.avatar,
      coverImage: type === blogImageTypes.coverImage
    }"
  >
    <slot />
    <button
      class="addImage__button"
      type="button"
      @click="$refs.fileInput.click()"
    >
      <bigplus-icon
        v-if="type === blogImageTypes.coverImage"
        class="addImage__plus"
      />
      <span class="addImage__small-button">
        {{ buttonText }}
      </span>
      <input
        v-show="false"
        ref="fileInput"
        type="file"
        class="alias-popup__file-input"
        name="upload-new"
        accept="image/*"
        @change="onFileChoose"
      />
    </button>
  </div>
</template>
<script>
import { mapActions } from 'vuex';
import BigplusIcon from '~svg/bigplus.svg';
import { blogImageTypes } from '@/services/Blog/blog.service';
import { createFormData, imageUpload } from '@/services/image.service';

export default {
  components: {
    BigplusIcon
  },
  props: {
    type: {
      type: String,
      required: true
    },
    buttonText: {
      type: String
    }
  },
  data() {
    return {
      blogImageTypes
    };
  },
  methods: {
    async onFileChoose(event) {
      try {
        const { accessUrl, baseUrl, imageIdentifier } = await imageUpload(
          createFormData(event)
        );

        this.$refs.fileInput.value = '';

        this.$emit('add', {
          type: this.type,
          data: {
            accessUrl,
            src: baseUrl,
            alt: name,
            identifier: imageIdentifier
          }
        });
      } catch (e) {
        this.addFlashMessage({
          message: e,
          type: 'failure'
        });
      }
    },
    ...mapActions(['addFlashMessage'])
  }
};
</script>
<style lang="scss" scoped>
.addImage {
  width: 100%;
  background-color: var(--BG-primary);
  position: relative;

  &:focus {
    outline: none;
  }

  &__button {
    background-color: var(--BG-primary-opacity);
    padding: var(--element-padding-xl);
    border-radius: var(--border-radius);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    min-width: 200px;
    transition: var(--transition-default);

    &:focus {
      outline: none;
    }
    &:hover {
      background-color: var(--BG-primary-opacity-hover);
    }
    &:hover > .addImage__small-button {
      border-color: var(--border-button-secondary-hover);
      color: var(--text-button-hover);
    }
    &:hover > ::v-deep svg {
      fill: var(--text-button-hover);
    }
  }

  &__small-button {
    background: transparent;
    padding: 8px var(--element-padding-xxl);
    border-radius: var(--border-radius);
    font-size: var(--size-button);
    font-family: 'OpenSans-Bold';
    transition: var(--transition-default);
    outline: none;
    border: var(--border-width-thin) solid var(--border-button-secondary);
    color: var(--text-button);
  }

  &.coverImage {
    height: var(--wallpaper-height);
  }
}

.hide {
  .addImage {
    &__plus {
      display: none;
    }
    &__button {
      transform: none;
      left: 0;
      bottom: 0;
      padding: 13.5px var(--element-padding-m);
      min-width: 100%;
      top: auto;
      border-radius: 0;
    }
    &__small-button {
      padding: 8px var(--element-padding-l);
    }
  }
}

::v-deep {
  svg {
    fill: var(--border-button-secondary);
    margin-bottom: var(--element-padding-l);
    transition: var(--transition-default);
  }
}
</style>
