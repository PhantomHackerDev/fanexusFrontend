<template>
  <div class="create-post-modal-wrapper">
    <modal
      class="create-post-modal modal-overlay--centered"
      :tags="editorTags"
      :settings="settings"
      @save="handleSave"
      :close-on-save="false"
      :action-disabled="
        !sharingBlogPost &&
          !reblogOfBlogPostId &&
          (spaceRemaining < 0 || !textLength)
      "
    >
      <template slot="body">
        <template v-if="sharingBlogPost">
          <blog-post
            class="section-blog-post"
            :data="sharedBlogPostData"
            :usedInModal="true"
            :show-comments="false"
            :show-action-buttons="false"
          />
          <hr class="divider" />
        </template>
        <h3 class="title-wrapper">
          Tags
          <router-link
            class="tagging-guide-link"
            :to="{ name: 'tagging-basics' }"
            >(Tagging guide)</router-link
          >
        </h3>
        <tag-input
          class="post-tags-input"
          :list="editorTags"
          @list-change="updateList"
          placeholder="Add tag"
        />
        <form-rich-text-editor
          v-model="editorValue"
          @space-remaining="spaceRemaining = $event"
          @text-length="textLength = $event"
        />
        <h3 class="title-wrapper">
          This post will be in
        </h3>
        <div v-if="eligibleShareToEntities" class="selects-wrapper">
          <form-select
            :options="shareToOptions"
            v-model="publishTo"
            name="publish-direction"
            optionsType="radiobuttons"
            class="wide"
          />
        </div>
        <h3 class="title-wrapper">
          In addition, immediately reblog this to
        </h3>
        <template v-if="eligibleShareToEntities">
          <div class="selects-wrapper">
            <form-select
              class="create-post-modal__share-to-options wide"
              title="Reblog options"
              :options="unselectedShareToOptions"
              @select="addShareTo"
              name="share-to-select"
              optionsType="text"
            />
          </div>
          <ul class="create-post-modal__sharing-to">
            <li
              class="create-post-modal__sharing-to-item"
              v-for="(shareToOption, index) of selectedShareToOptions"
              :key="
                `${shareToOption.value.name}-${shareToOption.value.feedType}-${index}`
              "
            >
              {{ shareToOption.label }}
              <button
                type="button"
                class="cross-button"
                @click.stop="unselectShareTo(shareToOption)"
              >
                <cross-icon class="cross-button__icon" />
              </button>
            </li>
          </ul>
        </template>
        <div class="general-privacy-area">
          <h3 class="title-wrapper">General</h3>
          <form-toggler
            class="create-post-modal__toggler"
            v-model="blogPostHideFromSearch"
            name="activeAliasData.hideFromSearchResults"
            context="settings"
            v-slot:after
            >Hide from search results</form-toggler
          >
          <form-toggler
            class="create-post-modal__toggler"
            :checked="hasTag(name)"
            @input="setHasTag(name, $event)"
            name="activeAliasData.isNsfw"
            context="settings"
            v-slot:after
            v-for="({ id, name }, index) of nsfwTags"
            :key="`${name}-${index}`"
            >#{{ name }}</form-toggler
          >
        </div>
        <h3 class="title-wrapper">Who can see this?</h3>
        <privacy-group-selection v-model="selectedPrivacyGroups.visibility" />
        <h3 class="title-wrapper">Who can comment on this?</h3>
        <privacy-group-selection v-model="selectedPrivacyGroups.commenting" />
      </template>
    </modal>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
/** @TODO add to a corresponding mixin */
import { feedTypes } from '@/services/feed.service';
import Modal from '~common/Modal';
import TagInput from '~common/Fields/TagInput';
import FormRichTextEditor from '~common/Fields/FormRichTextEditor';
import FormSelect from '~common/Fields/FormSelect';
import FormToggler from '~common/Fields/FormToggler';
import {
  createBlogPost,
  editBlogPost,
  getEligibleShareToEntitiesForAlias
} from '@/services/Blog/blog.service';
import { getTag, createTag } from '@/services/tag.service';
import BlogPost from '../Blog/BlogPost';
import PrivacyGroupSelection from '@/components/PrivacyGroup/PrivacyGroupSelection.vue';
import CrossIcon from '~svg/cross-icon.svg';

const nsfwTagNames = [
  'Graphic Nudity/Sexuality',
  'Graphic Violence/Gore',
  'Choose not to Warn'
];

export default {
  components: {
    Modal,
    TagInput,
    FormRichTextEditor,
    FormSelect,
    FormToggler,
    BlogPost,
    PrivacyGroupSelection,
    CrossIcon
  },
  props: {
    settings: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      alias: null,
      eligibleShareToEntities: {
        eligibleBlogs: [],
        eligibleCommunities: []
      },
      publishTo: null,
      shareTo: {
        blogs: [],
        communities: []
      },
      selectedPrivacyGroups: {
        visibility: [],
        commenting: []
      },
      blogPostHideFromSearch: false,
      spaceRemaining: 0,
      textLength: 0,
      saving: false,
      nsfwTags: [],
      editorOptions: {
        modules: {
          toolbar: [
            [{ size: [] }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ color: [] }, { background: [] }],
            [{ script: 'super' }, { script: 'sub' }],
            [{ header: '1' }, { header: '2' }, 'blockquote', 'code-block'],
            [
              { list: 'ordered' },
              { list: 'bullet' },
              { indent: '-1' },
              { indent: '+1' }
            ],
            [{ direction: 'rtl' }, { align: [] }],
            ['link', 'image', 'video', 'formula'],
            ['clean']
          ]
        }
      }
    };
  },
  methods: {
    ...mapActions([
      'setBlogPostContent',
      'setBlogPostTags',
      'reloadFeed',
      'addFlashMessage'
    ]),
    /** @TODO fix form-rich text editor issue, when we click first time */
    addShareTo(shareToOption) {
      if (shareToOption.value.feedType === feedTypes.blog) {
        this.shareTo.blogs.push(shareToOption);
      } else if (shareToOption.value.feedType === feedTypes.community) {
        this.shareTo.communities.push(shareToOption);
      }
    },
    async handleSave() {
      if (this.spaceRemaining >= 0 && !this.saving) {
        try {
          this.saving = true;
          if (this.sharingBlogPost) {
            const result = await this.shareBlogpost();
            this.addFlashMessage({
              message: 'Blog post shared',
              link: this.routerParams(result)
            });
          } else if (this.blogPostId) {
            const result = await this.updateBlogPost();
            this.addFlashMessage({
              message: 'Blog post updated',
              link: this.routerParams(result)
            });
          } else {
            const result = await this.createBlogPost();
            this.addFlashMessage({
              message: 'Blog post created',
              link: this.routerParams(result)
            });
          }
          this.$emit('submit');
        } catch {
          this.saving = false;
        }
      }
    },
    routerParams(newBlogPost) {
      const blogPostIn = newBlogPost.Blog || newBlogPost.Community;
      return {
        name: `${newBlogPost.BlogId ? 'blog' : 'community'}-with-blog-post`,
        params: {
          name: blogPostIn.link || blogPostIn.id,
          id: !blogPostIn.link ? 'id' : undefined,
          postId: newBlogPost.id
        }
      };
    },
    async createBlogPost(reblogOfBlogPost = null) {
      const payload = {
        alias: this.activeAliasId,
        content: this.currentEditorValue,
        shareTo: {
          blogs: this.shareTo.blogs
            .filter(({ value }) => value !== this.publishTo)
            .map(({ value: { id } }) => id),
          communities: this.shareTo.communities
            .filter(({ value }) => value !== this.publishTo)
            .map(({ value: { id } }) => id)
        },
        [this.publishTo.feedType]: this.publishTo.id,
        tagDisplays: this.editorTags.map(({ id, name, displaySynonym }) => ({
          id,
          displaySynonym: displaySynonym || name
        })),
        hideFromSearchResults: this.blogPostHideFromSearch,
        reblogOfBlogPost,
        viewingPrivacyGroups: this.selectedPrivacyGroups.visibility.map(
          privacyGroup => privacyGroup.id
        ),
        commentingPrivacyGroups: this.selectedPrivacyGroups.commenting.map(
          privacyGroup => privacyGroup.id
        )
      };
      const result = await createBlogPost(payload);
      await this.reloadFeed();
      return result;
    },
    async updateBlogPost() {
      const payload = {
        alias: this.activeAliasId,
        content: this.editorValue,
        tagDisplays: this.editorTags.map(({ id, name, displaySynonym }) => ({
          id,
          displaySynonym: displaySynonym || name
        })),
        hideFromSearchResults: this.blogPostHideFromSearch,
        viewingPrivacyGroups: this.selectedPrivacyGroups.visibility.map(
          privacyGroup => privacyGroup.id
        ),
        commentingPrivacyGroups: this.selectedPrivacyGroups.commenting.map(
          privacyGroup => privacyGroup.id
        )
      };
      const result = await editBlogPost(this.blogPostId, payload);
      await this.reloadFeed();
      return result;
    },
    async shareBlogpost() {
      const result = await this.createBlogPost(this.blogPostId);
      await this.reloadFeed();
      return result;
    },
    updateList(list) {
      this.editorTags = list;
    },
    async getEligibleShareToEntities() {
      this.eligibleShareToEntities = await getEligibleShareToEntitiesForAlias({
        alias: this.activeAliasId
      });
    },
    setDefaultPublishTo() {
      this.publishTo =
        this.feedType === feedTypes.community && !this.sharingBlogPost
          ? this.currentCommunityOption
          : this.shareToBlogOptions[0].value;
    },
    unselectShareTo(shareToOption) {
      if (shareToOption.value.feedType === feedTypes.blog) {
        this.shareTo.blogs.splice(
          this.shareTo.blogs.findIndex(blog => blog === shareToOption),
          1
        );
      } else if (shareToOption.value.feedType === feedTypes.community) {
        this.shareTo.communities.splice(
          this.shareTo.communities.findIndex(
            community => community === shareToOption
          ),
          1
        );
      }
    },
    async getNsfwTag() {
      this.nsfwTags = await Promise.all(
        nsfwTagNames.map(async nsfwTagName => {
          try {
            const result = (await getTag(nsfwTagName)).tag;
            return result;
          } catch {
            return await createTag(nsfwTagName, {
              parentTags: [],
              childTags: []
            });
          }
        })
      );
    },
    hasTag(tagName) {
      return this.editorTags.some(({ name }) => name === tagName);
    },
    setHasTag(tagName, value) {
      if (value) {
        this.editorTags.push({
          ...this.nsfwTags.find(({ name }) => name === tagName),
          displaySynonym: tagName
        });
      } else {
        this.editorTags.splice(
          this.editorTags.findIndex(({ name }) => name === tagName),
          1
        );
      }
    }
  },
  computed: {
    ...mapState({
      activeAliasId: state => state.alias.activeAliasId,
      currentEditorValue: state => state.blogPost.data.content,
      blogPostTags: state => state.blogPost.data.Tags,
      hideFromSearch: state => state.blogPost.data.hideFromSearchResults,
      blogPostId: state =>
        !state.blogPost.sharingBlogPost
          ? state.blogPost.data.id
          : state.blogPost.shareData.id,
      sharingBlogPost: state => state.blogPost.sharingBlogPost,
      feedData: state => state.feed.data,
      feedType: state => state.feed.type,
      sharedBlogPostData: state =>
        !state.blogPost.sharingBlogPost
          ? state.blogPost.data
          : state.blogPost.shareData,
      selectedVisibilityPrivacyGroups: state =>
        state.blogPost.data.viewingAccessControlGroups,
      selectedCommentingPrivacyGroups: state =>
        state.blogPost.data.commentingAccessControlGroups,
      reblogOfBlogPostId: state => state.blogPost.data.reblogOfBlogPostId
    }),
    ...mapGetters(['activeAliasBlog', 'defaultPrivacyGroups']),
    editorValue: {
      get() {
        return this.currentEditorValue;
      },
      set(value) {
        this.setBlogPostContent(value);
      }
    },
    editorTags: {
      get() {
        return this.blogPostTags;
      },
      set(value) {
        this.setBlogPostTags(value);
      }
    },
    shareToBlogOptions() {
      return this.eligibleShareToEntities.eligibleBlogs.map(({ id, name }) => ({
        label: `Blog: ${name}`,
        type: 'typetext',
        value: { id, feedType: feedTypes.blog }
      }));
    },
    shareToCommunityOptions() {
      return this.eligibleShareToEntities.eligibleCommunities.map(
        ({ id, name }) => ({
          label: `Community: ${name}`,
          value: { id, feedType: feedTypes.community }
        })
      );
    },
    shareToOptions() {
      return this.shareToBlogOptions.concat(this.shareToCommunityOptions);
    },
    selectedShareToOptions() {
      return this.shareTo.blogs.concat(this.shareTo.communities);
    },
    unselectedShareToOptions() {
      return this.shareToOptions.filter(
        shareToEntity =>
          !this.selectedShareToOptions.includes(shareToEntity) &&
          shareToEntity.value !== this.publishTo
      );
    },
    currentCommunityOption() {
      const currentPageCommunity = this.shareToCommunityOptions.find(
        communityOption => communityOption.value.id === this.feedData.id
      );
      return (
        (currentPageCommunity && currentPageCommunity.value) ||
        this.shareToBlogOptions[0].value
      );
    }
  },
  async mounted() {
    if (this.blogPostId) {
      this.blogPostHideFromSearch = this.hideFromSearch;
      this.selectedPrivacyGroups.visibility =
        this.selectedVisibilityPrivacyGroups || [];
      this.selectedPrivacyGroups.commenting =
        this.selectedCommentingPrivacyGroups || [];
    } else {
      this.blogPostHideFromSearch = this.activeAliasBlog.hideFromSearchResults;
      this.selectedPrivacyGroups.visibility = this.defaultPrivacyGroups;
      this.selectedPrivacyGroups.commenting = this.defaultPrivacyGroups;
    }

    const tagNamesParam = this.$route.params.tagNames;
    if (tagNamesParam && !this.sharingBlogPost && !this.blogPostId) {
      this.setBlogPostTags(
        JSON.parse(tagNamesParam)
          .filter(name => name)
          .map((name, index) => ({
            name,
            id: -index - 1
          }))
      );
    }
    await Promise.all([this.getEligibleShareToEntities(), this.getNsfwTag()]);
    this.setDefaultPublishTo();
  }
};
</script>

<style lang="scss" scoped>
.create-post-modal {
  &.modal-overlay--centered {
    .selects-wrapper {
      display: flex;
    }

    .title-wrapper {
      font-size: var(--size-regular);
      font-family: 'OpenSans-Bold', sans-serif;
      margin-bottom: var(--element-margin-m);
      color: var(--text-primary);
    }

    .post-tags-input {
      margin-bottom: var(--element-margin-s);
    }
  }

  .general-privacy-area {
    padding-bottom: var(--element-padding-l);
  }

  &__sharing-to {
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    margin: 0 -5px 20px -5px;
    &-item {
      color: var(--text-primary);
      font-size: var(--size-small);
      padding: var(--element-padding-xs);
      border: 1px solid var(--border-tag);
      border-radius: var(--border-radius);
      margin: var(--element-margin-xs);
      max-width: 100%;
      word-wrap: break-word;
      overflow: hidden;
    }
  }
}

.tagging-guide-link {
  font-size: var(--size-small);
  color: var(--text-secondary);
  text-decoration: none;
}

.wide {
  min-width: 250px;
}

.section-blog-post {
  margin-bottom: var(--element-margin-m);
}

.divider {
  color: var(--divider-in-popup);
}

::v-deep {
  .quill-editor-container {
    margin-bottom: 5px;
  }
  .rich-text-editor .textarea {
    min-height: 214px;
  }
  .select-options-container {
    margin-bottom: 0;
  }

  .modal {
    margin: 0 auto;
    width: var(--width-medium);
    overflow: visible;

    &-content {
      margin: 0;
    }
  }
  .modal-header,
  .modal-footer {
    background-color: var(--BG-create-post-modal);
  }
  .modal-body {
    background-color: var(--BG-create-post-modal-body);
  }
  .select {
    width: 170px;
    min-width: 170px;
    margin: 0 var(--element-margin-s) var(--element-margin-l) 0;
    &.wide {
      width: 300px;
      min-width: 300px;
    }

    button,
    ul {
      border-color: var(--tab-normal);
    }
    button {
      padding: var(--button-padding-s) var(--element-padding-s);
    }

    &:last-child {
      margin-right: 0;
    }
  }

  .form-input input {
    padding: var(--element-padding-xs) var(--element-padding-xs)
      var(--element-padding-xs) var(--element-padding-xl);
  }
  .toggler {
    margin-bottom: var(--element-margin-s);
  }
}

.cross-button {
  position: relative;
  background: transparent;
  outline: none;

  &__icon {
    stroke-width: 5px;
    stroke: var(--text-primary);
    width: 10px;
    height: 8px;
  }
}
</style>
