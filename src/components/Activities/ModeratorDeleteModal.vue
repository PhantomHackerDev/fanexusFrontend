<template>
  <div class="moderator-delete-modal-wrapper">
    <modal
      class="moderator-delete-modal modal-overlay--centered"
      @save="submitModeratorDelete"
      :settings="settings"
    >
      <template slot="body">
        <form class="moderator-delete-modal__form" ref="form">
          <form-input
            class="moderator-delete-modal__reason"
            type="textarea"
            name="reason"
            placeholder="Reason..."
            v-model="reason"
          />
        </form>
      </template>
    </modal>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import FormInput from '~common/Fields/FormInput';
import Modal from '~common/Modal';
import { commentDelete } from '@/services/Comment/comment.service';

export default {
  components: {
    Modal,
    FormInput
  },
  props: {
    settings: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      reason: ''
    };
  },
  methods: {
    async submitModeratorDelete() {
      if (this.deleteType === 'blog-post') {
        await this.deleteBlogPost({
          id: this.deleteId,
          payload: { alias: this.activeAliasId, reason: this.reason }
        });
      } else if (this.deleteType === 'comment') {
        await commentDelete(this.deleteId, {
          alias: this.activeAliasId,
          reason: this.reason
        });
      }
      this.setModeratorDelete({ id: null });
    },
    ...mapActions(['setModeratorDelete', 'deleteBlogPost'])
  },
  computed: {
    ...mapState({
      deleteId: state => state.moderation.id,
      deleteType: state => state.moderation.type
    })
  }
};
</script>

<style lang="scss" scoped>
.moderator-delete-modal__reason {
  background-color: var(--BG-input);
}

::v-deep {
  .modal {
    margin: 0 auto;
    width: var(--width-medium);
  }
}
</style>
