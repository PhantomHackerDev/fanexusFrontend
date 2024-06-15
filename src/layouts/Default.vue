<template>
  <!-- /*@TODO check out logged-in class condition*/ -->
  <div class="wrapper layout" :class="{ logged: isAuthenticated }">
    <fanexus-aside-menu
      v-if="isAuthenticated"
      :show="asideToggled"
      @asideToggled="handleAsideToggled"
    />
    <fanexus-header
      :isAsideOpened="asideToggled"
      @openAuthModal="handleOpenAuthModal"
      @openCreatePostModal="handleOpenCreatePostModal"
      @asideToggled="handleAsideToggled"
    />
    <fanexus-footer v-if="!isMobile" />
    <create-post-modal
      v-if="createPostModalSettings.show"
      :settings="createPostModalSettings"
      @submit="afterCreateBlogPost"
    />
    <blog-post-modal
      v-if="$route.params.postId && blogModalSettings.show"
      :settings="blogModalSettings"
      :key="$route.params.postId"
      @openSubmitReportModal="handleOpenSubmitReportModal"
    />
    <auth
      v-if="authModalSettings.show"
      :settings="authModalSettings"
      @submit="handleAuthSubmit"
    />
    <image-preview-modal v-if="imagePreviewSrc" />
    <image-viewer-modal v-if="currentImageSrc" />
    <blog-edit-modal
      v-if="blogEditModalSettings.show"
      :settings="blogEditModalSettings"
      :name="$route.params.name"
      :id="$route.params.id"
    />
    <community-edit-modal
      v-if="communityEditModalSettings.show"
      :settings="communityEditModalSettings"
      :name="$route.params.name"
    />
    <report-modal
      v-if="submitReportModalSettings.show"
      :settings="submitReportModalSettings"
      @submit="afterSubmitReport"
    />
    <moderator-delete-modal
      v-if="moderatorDeleteModalSettings.show"
      :settings="moderatorDeleteModalSettings"
    /><confirm-action-modal
      v-if="confirmationModalSettings.show"
      :settings="confirmationModalSettings"
    /><flash-message type="failure" v-if="loginFailure || signupFailure">{{
      authFailureMessage
    }}</flash-message
    ><flash-message
      v-for="({ message, id, link, linkText, type }, index) of flashMessages"
      :key="`${id}-${index}`"
      :type="type"
      >{{ message
      }}<span v-if="link" class="flash-message-link"
        ><router-link class="flash-message-link__anchor" :to="link">{{
          linkText || 'View'
        }}</router-link></span
      ></flash-message
    >
    <icon-button
      v-if="isAuthenticated && isMobile"
      icon="bordered-pencil"
      class="mobile-create-post-button"
      @click.native="handleOpenCreatePostModal"
    />
    <back-to-top v-if="isMobile" @click.native="$emit('back-to-top')" />
    <slot />
  </div>
</template>

<script>
import { APP_TITLE } from '@/services/config';
import Auth from '@/components/Auth/Auth';
import FanexusFooter from '@/components/Layout/Footer';
import FanexusHeader from '@/components/Layout/Header';
import FanexusAsideMenu from '@/components/Layout/AsideMenu';
import BlogPostModal from '@/components/Blog/BlogPostModal.vue';
import { mapActions, mapState, mapGetters } from 'vuex';
import CreatePostModal from '@/components/Activities/CreateBlogPostModal';
import ImagePreviewModal from '@/components/common/ImagePreviewModal';
import ImageViewerModal from '@/components/common/ImageViewerModal';
import { blogPostEditorTitles } from '@/services/BlogPost/blogPost.service';
import BlogEditModal from '@/components/Blog/BlogEditModal.vue';
import CommunityEditModal from '@/components/Community/CommunityEditModal.vue';
import ReportModal from '@/components/Activities/ReportModal.vue';
import ModeratorDeleteModal from '@/components/Activities/ModeratorDeleteModal.vue';
import ConfirmActionModal from '@/components/Activities/ConfirmActionModal.vue';
import IconButton from '@/components/common/Buttons/IconButton.vue';
import BackToTop from '@/components/common/BackToTop.vue';
import FlashMessage from '~common/FlashMessage';

export default {
  components: {
    Auth,
    CreatePostModal,
    BlogPostModal,
    FanexusFooter,
    FanexusHeader,
    FanexusAsideMenu,
    ImagePreviewModal,
    ImageViewerModal,
    BlogEditModal,
    CommunityEditModal,
    ReportModal,
    ModeratorDeleteModal,
    ConfirmActionModal,
    IconButton,
    BackToTop,
    FlashMessage
  },
  data() {
    const context = this;
    return {
      asideToggled: false,
      authModalSettings: {
        title: APP_TITLE,
        show: false,
        auth: true,
        initialTab: []
      },
      blogModalSettings: {
        hideHeader: true,
        get show() {
          return (
            !isNaN(Number(context.$route.params.postId)) &&
            !context.editingBlogPost
          );
        }
      },
      createPostModalSettings: {
        get show() {
          return context.editingBlogPost;
        },
        set show(value) {
          context.setEditingBlogPost(value);
        },
        get title() {
          return `${context.createPostModalTitle} post`;
        },
        dismissText: 'Cancel',
        actionText: 'Publish'
      },
      editTagsModalSettings: {
        title: 'Edit tags',
        dismissText: 'Cancel',
        actionText: 'Save tags',
        get show() {
          return context.showEditTagsModal;
        },
        set show(value) {
          context.openEditTagsModal(value);
        }
      },
      blogEditModalSettings: {
        title: 'Edit blog profile',
        dismissText: 'Cancel',
        actionText: 'Save',
        get show() {
          return context.$route.name === 'edit-blog';
        },
        set show(value) {
          if (!value) {
            context.$router.push({
              name: context.$route.name.replace('edit-', '')
            });
          }
        }
      },
      communityEditModalSettings: {
        title: 'Edit community',
        dismissText: 'Cancel',
        actionText: 'Save',
        get show() {
          return context.$route.name === 'edit-community';
        },
        set show(value) {
          if (!value) {
            context.$router.push({
              name: context.$route.name.replace('edit-', '')
            });
          }
        }
      },
      submitReportModalSettings: {
        title: 'Submit A Report',
        actionText: 'Submit',
        dismissText: 'Cancel',
        postId: null,
        commentId: null,
        get show() {
          return context.showSubmitReportModal;
        },
        set show(value) {
          context.openSubmitReportModal(value);
        }
      },
      moderatorDeleteModalSettings: {
        title: 'Delete as moderator',
        actionText: 'Delete',
        dismissText: 'Cancel',
        get show() {
          return context.deleteId;
        },
        set show(value) {
          context.setModeratorDelete({ id: null, type: null });
        }
      },
      confirmationModalSettings: {
        title: 'Confirm action',
        actionText: 'Confirm',
        dismissText: 'Cancel',
        get show() {
          return context.confirming;
        },
        set show(value) {
          context.cancelAction();
        }
      },
      blogPostEditorTitles,
      loginFailureMessage: 'Wrong email or password',
      signupFailureMessage:
        'Email does not match signup key or signup key was incorrect'
    };
  },
  computed: {
    ...mapState({
      isAuthenticated: state => state.auth.isAuthenticated,
      loginFailure: state => state.auth.loginFailure,
      signupFailure: state => state.auth.signupFailure,
      showEditTagsModal: state => state.tags.showEditTagsModal,
      showBlogEditModal: state => state.feed.showBlogEditModal,
      showSubmitReportModal: state => state.feed.showSubmitReportModal,
      showCommunityEditModal: state => state.feed.showCommunityEditModal,
      blogPostEditContent: state => state.blogPost.data.content,
      editingBlogPost: state => state.blogPost.editingBlogPost,
      newBlogPost: state => !state.blogPost.data.id,
      imagePreviewSrc: state => state.blogPost.imagePreviewSrc,
      sharingBlogPost: state => state.blogPost.sharingBlogPost,
      currentImageSrc: state => state.imageViewer.currentImageSrc,
      deleteId: state => state.moderation.id,
      confirming: state => state.confirmation.confirming,
      flashMessages: state => state.activities.flashMessages
    }),
    ...mapGetters(['isMobile']),
    createPostModalTitle() {
      if (this.sharingBlogPost) {
        return blogPostEditorTitles.share;
      } else if (this.newBlogPost) {
        return blogPostEditorTitles.newPost;
      }
      return blogPostEditorTitles.editPost;
    },
    authFailureMessage() {
      return this.loginFailure
        ? this.loginFailureMessage
        : this.signupFailureMessage;
    }
  },
  methods: {
    ...mapActions([
      'openEditTagsModal',
      'openSubmitReportModal',
      'setCreateBlogPost',
      'setEditBlogPost',
      'setEditingBlogPost',
      'setModeratorDelete',
      'cancelAction'
    ]),
    handleOpenAuthModal(componentName) {
      this.authModalSettings.initialTab = componentName;
      this.authModalSettings.show = true;
    },
    /*@TODO revise to respect the create account option*/
    handleAuthSubmit() {
      this.authModalSettings.show = false;
    },
    handleAsideToggled() {
      this.asideToggled = !this.asideToggled;
    },
    handleOpenCreatePostModal() {
      this.setEditBlogPost();
    },
    afterCreateBlogPost() {
      this.createPostModalSettings.show = false;
      this.$slots.default[0].elm.focus();
    },
    handleOpenSubmitReportModal(details) {
      this.submitReportModalSettings.show = true;
      this.submitReportModalSettings.isBlogPost = details.isBlogPost;
      this.submitReportModalSettings.postId = details.postId;
      this.submitReportModalSettings.commentId = details.commentId;
      this.submitReportModalSettings.postingAlias = details.postingAlias;
      this.submitReportModalSettings.updatedAt = details.updatedAt;
    },
    afterSubmitReport() {
      this.submitReportModalSettings.show = false;
      this.$slots.default[0].elm.focus();
    }
  },
  watch: {
    $route() {
      if (this.isMobile) {
        this.asideToggled = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.flash-message-link {
  margin-left: var(--element-margin-s);

  &__anchor {
    text-decoration: none;
    color: var(--text-secondary);
  }
}
.mobile-create-post-button {
  position: fixed;
  bottom: 15px;
  right: 15px;
  width: 36px;
  height: 30px;
  z-index: var(--z-index-1);
  fill: var(--text-primary);
}
</style>
