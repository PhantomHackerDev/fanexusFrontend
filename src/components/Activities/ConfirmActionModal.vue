<template>
  <div class="confirm-action-modal-wrapper">
    <modal
      class="confirm-action-modal modal-overlay--centered"
      @save="confirmAction"
      :settings="settings"
    >
      <template slot="body">
        <div class="confirm-action-modal__message">
          {{ confirmMessage }}
        </div>
      </template>
    </modal>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import Modal from '~common/Modal';

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
  methods: {
    ...mapActions(['confirmAction'])
  },
  computed: {
    ...mapState({
      action: state => state.confirmation.action,
      confirmMessage: state => state.confirmation.message
    })
  }
};
</script>

<style lang="scss" scoped>
.confirm-action-modal__message {
  color: var(--text-primary);
  text-align: center;
}

::v-deep {
  .modal {
    margin: 0 auto;
    width: var(--width-medium);
  }
}
</style>
