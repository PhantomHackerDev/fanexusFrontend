<template>
  <modal
    @save="sendData"
    @close="$emit('close')"
    :settings="settings"
    class="alias-popup modal-overlay--centered"
  >
    <template slot="body">
      <div class="alias-popup__container">
        <p class="alias-popup__text">
          Each alias has their own blog and display name. You may have a maximum
          of 3 aliases.
        </p>
        <form action="">
          <form-input
            labelText="Alias Name"
            class="alias-popup__name"
            type="text"
            placeholder="Alias name"
            name="Alias-name"
            v-model="data.aliasName"
          />
          <div class="alias-popup__new-group">
            <div class="alias-popup__new-group-input">
              <form-input
                labelText="Alias and blog avatar"
                class="alias-popup__new-group-name"
                type="text"
                name="new-alias-name"
                v-model="data.accessUrl"
                placeholder="imagename.jpg"
              />
              <form-button
                type="button"
                class="alias-popup__new-group-button button--submit"
                text="Upload New"
                @click.native="$refs.fileInput.click()"
              />
              <input
                v-show="false"
                ref="fileInput"
                type="file"
                class="alias-popup__file-input"
                name="upload-new"
                accept="image/*"
                @change="onFileChoose"
              />
            </div>
            <span
              v-if="avatarStatusMessage"
              class="alias-popup__file-input-status"
              :class="avatarStatusStyle"
              >{{ avatarStatusMessage }}</span
            >
          </div>
        </form>
      </div>
    </template>
  </modal>
</template>
<script>
import { mapActions } from 'vuex';
import FormButton from '../common/Buttons/FormButton';
import FormInput from '../common/Fields/FormInput';
import Modal from '../common/Modal';
import { createFormData, imageUpload } from '@/services/image.service';
import { createNewAlias } from '@/services/alias.service';

export default {
  components: {
    FormButton,
    FormInput,
    Modal
  },
  data() {
    return {
      uploading: false,
      uploaded: false,
      uploadUrl: null
    };
  },
  props: {
    data: {
      type: Object,
      required: true
    },
    settings: {
      type: Object,
      required: true
    }
  },
  computed: {
    avatarStatusMessage() {
      return this.uploaded && this.uploadUrl === this.data.accessUrl
        ? 'Uploaded'
        : this.uploading
        ? 'Uploading...'
        : '';
    },
    avatarStatusStyle() {
      return this.uploaded ? 'uploaded' : this.uploading ? 'uploading' : null;
    }
  },
  methods: {
    ...mapActions(['getUserAliases']),
    async onFileChoose(event) {
      this.uploaded = false;
      this.uploading = true;
      const { accessUrl, baseUrl, imageIdentifier } = await imageUpload(
        createFormData(event)
      );
      this.data.accessUrl = this.uploadUrl = accessUrl;
      this.data.baseUrl = baseUrl;
      this.data.imageIdentifier = imageIdentifier;

      this.$refs.fileInput.value = '';
      this.uploading = false;
      this.uploaded = true;
    },
    async sendData() {
      const {
        aliasName: name,
        accessUrl,
        baseUrl,
        imageIdentifier: identifier
      } = this.data;

      await createNewAlias({
        name,
        avatar: {
          name,
          src: baseUrl || accessUrl,
          alt: name,
          identifier
        }
      });
      await this.getUserAliases();
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/common/_mixins';
.alias-popup {
  @include mobile {
    z-index: var(--z-index-popup-overlay);
  }
  &__container {
    padding: var(--element-padding-xl) var(--element-margin-l) 0;
  }

  &__name {
    margin-bottom: var(--element-margin-xl);
  }

  &__new-group {
    padding-bottom: var(--element-margin-xl);

    &-input {
      display: flex;
      align-items: flex-end;
    }

    &-name {
      flex: 1 0 0;
      margin-right: var(--element-margin-s);
    }

    &-button {
      height: 41px;
    }
  }

  &__file-input-status {
    font-size: var(--size-small);
  }

  &__text {
    color: var(--text-primary);
    margin-bottom: var(--element-margin-xl);
    font-size: var(--size-small);
    line-height: var(--size-title);
  }
}

.uploading {
  color: var(--text-primary);
}
.uploaded {
  color: var(--success);
}

::v-deep {
  .modal {
    margin: 0 auto;
    width: 580px;
    .modal-body {
      padding: 0;
    }
    &-content {
      margin: 0;
    }
  }
  label {
    font-size: var(--size-regular);
  }
  .modal-header,
  .modal-footer {
    background-color: var(--BG-create-post-modal-body);
  }

  .modal-body {
    background-color: var(--BG-create-post-modal);
  }

  .button--submit {
    background-color: var(--BG-button-secondary);
    color: var(--text-button-secondary);
    &:focus,
    &:hover {
      background-color: var(--BG-button-secondary-hover);
      border-color: var(--border-button-secondary-hover);
      color: var(--text-button-comment);
    }
    &.button--disabled,
    &.button--disabled:hover {
      cursor: not-allowed;
      background-color: var(--BG-button-secondary-disabled);
      border-color: var(--border-button-secondary-disabled);
      color: var(--text-button-comment);
    }
  }
}
</style>
