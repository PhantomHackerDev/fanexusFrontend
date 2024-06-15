<template>
  <modal
    :settings="settings"
    class="confirmation-modal modal-overlay--centered"
    @save="$emit('submit')"
  >
    <template slot="body">
      <p class="confirmation-modal__desc">
        {{ settings.message || defaultMessage }}
        <template v-if="hasRemovedItems">
          <strong>{{ settings.removedItem }}</strong>
          from
          <strong>{{ settings.removedFrom }}</strong>
        </template>
        ?
      </p>
    </template>
  </modal>
</template>

<script>
import Modal from '../common/Modal';
export default {
  components: {
    Modal
  },
  props: {
    settings: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      /** @TODO revise this as soon as we have translation */
      defaultMessage: 'Are you sure you want to remove'
    };
  },
  computed: {
    hasRemovedItems() {
      return this.settings.removedItem && this.settings.removedFrom;
    }
  }
};
</script>

<style lang="scss" scoped>
.confirmation-modal__desc {
  font-family: OpenSans-Regular;
  font-size: var(--size-regular);
  color: var(--text-primary);
  margin-bottom: var(--element-margin-l);
  line-height: 1.5em;
}
</style>
