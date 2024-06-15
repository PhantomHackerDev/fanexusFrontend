<template>
  <modal :settings="settings" class="modal-request modal-overlay--centered">
    <template slot="body">
      <blog-post
        :data="data"
        :show-comments="false"
        :show-action-buttons="false"
      />
    </template>
  </modal>
</template>

<script>
import Modal from '~common/Modal';
import BlogPost from '@/components/Blog/BlogPost';
export default {
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

  components: {
    BlogPost,
    Modal
  }
};
</script>

<style lang="scss" scoped>
.modal-request {
  ::v-deep .modal-body {
    padding: 0;
  }

  &.modal-overlay--centered {
    ::v-deep .modal-content {
      margin: var(--element-margin-l) auto;
      width: var(--width-large);
    }
  }

  ::v-deep {
    .modal-content {
      overflow: hidden;
    }
    .blog-post-body__content {
      margin: 0;
      padding: var(--element-padding-l);
    }
  }
}
</style>
