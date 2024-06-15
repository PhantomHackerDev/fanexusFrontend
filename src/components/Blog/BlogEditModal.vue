<template>
  <div class="edit-blog" v-if="data">
    <modal
      class="edit-blog-modal modal-overlay--centered"
      :settings="settings"
      @save="handleSave"
      :close-on-save="false"
      :action-disabled="disableSave"
    >
      <template slot="body">
        <add-image
          :type="blogImageTypes.coverImage"
          class="edit-blog__add-bg"
          button-text="Change Background"
          @add="handleAddImage"
        >
          <wallpaper :src="coverImageData" />
        </add-image>
        <div class="edit-blog__header">
          <div class="edit-blog__header-wrapper">
            <add-image
              :type="blogImageTypes.avatar"
              class="edit-blog__header-add-img"
              @add="handleAddImage"
              button-text="Change Image"
            >
              <avatar
                class="blog-header__avatar"
                size="xl"
                :file="avatarImageData"
              />
            </add-image>
          </div>
          <tabs
            :tabs="navTabs"
            @select-tab="$active => setComponent($active, $active)"
            :active="activeTab"
          />
        </div>
        <component
          :is="currentComponent"
          v-model="data"
          :errors="errors"
          @clear-error="clearError"
          @space-remaining="spaceRemaining = $event"
          @space-remaining-links="
            $set(spaceRemainingLinks, $event.index, $event.space)
          "
        />
      </template>
    </modal>
  </div>
</template>

<script>
import FormButton from '~common/Buttons/FormButton';
import FormInput from '~common/Fields/FormInput';
import { mapState, mapGetters, mapActions } from 'vuex';
import { feedTypes } from '@/services/feed.service';
import { getBlogData, blogEditAreas } from '@/services/Blog/blog.service';
import Modal from '~common/Modal';
import AddImage from '~common/AddImage';
import { blogImageTypes, editBlog } from '@/services/Blog/blog.service';
import Wallpaper from '~common/Wallpaper';
import Avatar from '~common/Avatar';
import TagInput from '~common/Fields/TagInput';
import validationMixin from '@/mixins/validation.mixin';
import Tabs from '~common/Tabs';
import tabsMixin from '@/mixins/tabs.mixin';
import BlogProfile from '@/components/Blog/BlogProfile';
import BlogSettings from '@/components/Blog/BlogSettings';

export default {
  components: {
    AddImage,
    Wallpaper,
    Avatar,
    FormButton,
    FormInput,
    Modal,
    Tabs,
    TagInput,
    BlogProfile,
    BlogSettings
  },
  props: {
    name: {
      type: [Number, String],
      required: true
    },
    settings: {
      type: Object,
      required: true
    },
    id: {
      type: String
    }
  },
  mixins: [tabsMixin, validationMixin],
  data() {
    return {
      blogImageTypes,
      feedTypes,
      errors: [],
      activeTab: 0,
      data: null,
      currentComponent: 'blog-profile',
      navTabs: [
        {
          title: 'Profile',
          component: blogEditAreas.profile
        },
        {
          title: 'Settings',
          component: blogEditAreas.settings
        }
      ],
      saving: false,
      spaceRemaining: 0,
      spaceRemainingLinks: []
    };
  },
  computed: {
    ...mapState({
      activeAliasId: state => state.alias.activeAliasId,
      list: state => state.tags.list
    }),
    ...mapGetters(['activeAlias']),
    /** @TODO make it common between blog and community */
    coverImageData() {
      if (!this.data || !this.data.coverImage) return '';

      return this.data.coverImage.accessUrl || this.data.coverImage.src;
    },
    /** @TODO make it common between blog and community */
    avatarImageData() {
      if (!this.data || !this.data.avatar) return '';

      return this.data.avatar.accessUrl || this.data.avatar.src;
    },
    disableSave() {
      return (
        this.spaceRemaining < 0 ||
        this.spaceRemainingLinks.some(
          ruleSpaceRemaining => ruleSpaceRemaining < 0
        )
      );
    }
  },
  methods: {
    setComponent(tabIndex = 0, componentIndex = 0) {
      this.handleSetActiveTab(tabIndex);
      this.currentComponent = ['blog-profile', 'blog-settings'][componentIndex];
    },
    addLink() {
      this.data.links.push('');
    },
    goBack() {
      this.$router.go(-1);
    },
    handleAddImage({ type, data }) {
      this.data[type] = { ...data };
    },
    async handleSave() {
      if (this.saving) {
        return;
      }
      this.saving = true;

      const {
        name,
        link,
        links,
        description,
        avatar,
        coverImage,
        contentAccessControl,
        followsAccessControl,
        commentsAccessControl,
        reactionsAccessControl,
        hideFromSearch
      } = this.data;
      const payload = {
        alias: this.activeAliasId,
        name,
        link,
        links,
        description,
        ...(coverImage.accessUrl && { coverImage }),
        ...(avatar.accessUrl && { avatar }),
        tagDisplays: this.data.Tags.map(({ id, name, displaySynonym }) => ({
          id,
          displaySynonym: displaySynonym || name
        })),
        contentAccessControl,
        followsAccessControl,
        commentsAccessControl,
        reactionsAccessControl,
        hideFromSearchResults: hideFromSearch,
        showMinors: !this.data.hideFromMinors
      };

      try {
        await editBlog(this.data.id, payload);
        const feedParams = {
          name: link || this.data.id,
          id: link ? undefined : 'id'
        };
        this.updateFeedParams(feedParams);
        await Promise.all([this.reloadFeed(), this.getUserAliases()]);
        this.$router.push({
          name: 'blog',
          params: feedParams
        });
        this.addFlashMessage({
          message: 'Blog updated'
        });
      } catch (e) {
        this.errors = e.response.data.errors || [];
        this.addFlashMessage({
          message: 'Blog update failed',
          type: 'failure'
        });
        this.saving = false;
      }
    },
    ...mapActions([
      'reloadFeed',
      'getUserAliases',
      'updateFeedParams',
      'addFlashMessage'
    ])
  },
  async mounted() {
    this.data = (blogData => ({
      ...blogData,
      hideFromSearch: blogData.hideFromSearchResults,
      hideFromMinors: !this.activeAlias.showMinors
    }))(
      await getBlogData({
        name: this.name,
        pagination: 1,
        id: this.id
      })
    );
  }
};
</script>

<style lang="scss" scoped>
.edit-blog {
  grid-area: content;
  overflow: auto;
  background-color: var(--BG-primary);

  &__header {
    display: grid;
    align-items: end;
    grid-template-rows: minmax(0, 60px);
    grid-template-columns:
      var(--width-very-small)
      auto;
    grid-gap: var(--element-margin-xl);
    background-color: var(--BG-blog-post);
    padding: 0 var(--element-padding-xl);

    &-wrapper {
      border: var(--border-width-avatar) solid var(--color-white);
      height: 120px;
      z-index: 1;
      border-radius: var(--border-radius);
    }

    &-add-img {
      height: 100%;

      ::v-deep .xl {
        border-radius: 0;
        height: 100%;
      }
    }
  }
}

::v-deep .error {
  margin-bottom: var(--element-margin-xs);
  input,
  textarea {
    border-color: var(--border-input-error);
  }
}
</style>
