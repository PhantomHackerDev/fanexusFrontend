<template>
  <modal
    class="mobile-description-modal modal-overlay--centered"
    :settings="settings"
  >
    <template slot="body">
      <p class="mobile-description-modal__text" v-html="text"></p>
    </template>
  </modal>
</template>

<script>
import Modal from '~common/Modal';

export default {
  props: {
    settings: {
      type: Object,
      required: true
    },
    text: {
      type: String
    }
  },
  components: {
    Modal
  }
};
</script>

<style lang="scss" scoped>
.mobile-description-modal {
  &__text {
    font-size: 16px;
    color: var(--text-primary);
    margin: 0;
    padding: var(--element-padding-s) 0;
    ::v-deep a {
      color: inherit;
    }
  }
}
</style>
