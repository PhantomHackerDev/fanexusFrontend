<template>
  <div class="edit-tags-modal-wrapper">
    <modal
      class="edit-tags-modal modal-overlay--centered"
      @save="saveTags"
      :settings="settings"
    >
      <template slot="body">
        <form
          class="edit-tags-modal__form"
          @submit.prevent="submitTagEdit"
          ref="form"
        >
          <tag-input
            :list="list"
            placeholder="Add tag"
            @list-change="setTagsList"
          />
        </form>
      </template>
    </modal>
  </div>
</template>

<script>
import Modal from '../common/Modal';
import TagInput from '~common/Fields/TagInput';
import { mapActions, mapState } from 'vuex';

export default {
  components: {
    Modal,
    TagInput
  },
  props: {
    settings: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapState({
      list: state => state.tags.list,
      saveTags: state => state.tags.saveTagsMethod
    })
  },
  methods: {
    ...mapActions(['setTagsList'])
  }
};
</script>

<style lang="scss" scoped></style>
