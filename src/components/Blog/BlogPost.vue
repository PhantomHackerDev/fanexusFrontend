<template>
  <article class="blog-post" ref="blogPost" :style="styleObject">
    <div class="blog-post__wrapper" ref="wrapper">
      <div v-if="sortedReblogsDisplay && sortedReblogsDisplay.length">
        <blog-post
          v-for="(reblog, index) of sortedReblogsDisplay"
          :key="`${reblog.id}-${index}`"
          class="blog-post__reposted"
          :data="reblog"
          :usedInModal="usedInModal"
          :showComments="false"
          :showActionButtons="false"
          :expandable="expandable"
          @select-tag="$emit('select-tag', $event)"
          @resized="resizeCounter++"
        />
      </div>
      <header class="blog-post__header" slot="header">
        <div
          class="blog-post__header-pictures-count"
          v-if="images.length > 1"
          @click.stop="openFirstImage"
        >
          <image-icon class="blog-post__header-pictures-count-icon" /><span
            class="blog-post__header-pictures-count-number"
            >{{ imageNumber }}</span
          >
        </div>
        <author-title
          class="blog-post__header-title"
          @author-click="goToBlog"
          @go-to-blog-post="goToBlogPost"
          :name="authorTitleData.Alias.name"
          :blog-alias-name="isShared && !data.content ? data.Alias.name : ''"
          :image="authorTitleData.Alias.avatar.src"
          :date="authorTitleData.updatedAt"
          :alt="authorTitleData.Alias.avatar.alt"
          :is-shared="isShared"
          :community="hasCommunity"
          :reblog-id="lastInReblogChain && lastInReblogChain.id"
          :blogParams="blogParams"
          :blogPostParams="blogPostParams"
        />
      </header>
      <expandable
        class="blog-post__body"
        content-label="post"
        :expandable="expandable"
        @resized="resizeCounter = $event"
        ref="content"
      >
        <div class="blog-post__body-tags">
          <tags-list
            v-if="data && data.Tags"
            :list="data.Tags"
            @click.native.prevent
            v-on="tagListListeners"
            :removable="false"
          />
        </div>
        <router-link
          v-bind:to="{
            name: `${this.$route.name}-with-blog-post`,
            params: blogPostParams
          }"
        >
          <img
            ref="blogPostImage"
            class="blog-post__body-image"
            v-if="data && data.image"
            :src="data.image.src"
            :alt="data.image.name"
          />
          <p
            ref="blogPostText"
            class="blog-post__body-content"
            :class="{ 'has-action': !usedInModal }"
            @click="handleContentClick"
            v-html="
              isShared && !data.content
                ? lastInReblogChain.content
                : data.content.trim().length
                ? data.content
                : 'This block post is blank or is a reblog of a deleted blog post.'
            "
          />
        </router-link>
      </expandable>
      <action-buttons-group
        v-if="showActionButtons"
        :engagementStats="shownEngagementStats"
        :userHasEditPermissions="data.userHasEditPermissions"
        @click.native.prevent
        @likeClicked="postLikeToggle"
        @delete="onDeleteBlogPostBtnClicked"
        @edit="editBlogPostHandler"
        @report="handleReportPost()"
        :userLiked="data.userLiked"
        :options="dropdownOptions(data.userHasEditPermissions, isModerator)"
        :disabled="disabled"
        @close="$emit('close')"
        @openBlogPostModal="openBlogPostModal"
        @reblog="shareBlogPostHandler"
        :forBlogPost="true"
      />
      <comments
        slot="footer"
        v-if="showComments"
        :blogPostId="data.id"
        :newComment="newComment"
        :comments="shownComments"
        :is-blog-post-author="data.userHasEditPermissions"
        :can-comment="isAuthenticated && data.hasCommentPermissions"
        :background-color="backgroundColor"
        :directThread="commentThread"
        @createComment="handleCreateComment"
        @space-remaining="spaceRemaining = $event"
        @delete="onDeleteCommentBtnClicked"
        @refresh="refresh"
        @reportComment="handleReportComment($event)"
        @new-comment-input="$newComment => (newComment = $newComment)"
        @goToThread="shownComments = [$event]"
        @refreshData="refreshComments"
      />
    </div>
  </article>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import { removeCommentById } from '@/utils/array';
import userContent from '@/utils/userContent';
import { routerSecureNavigation } from '@/services/router.service';
import { postLike, postUnlike } from '@/services/Blog/blog.service';
import dropdownOptions from '@/services/BlogPost/blogPost.dropdownOptions';
import {
  createComment,
  getComment,
  commentDelete
} from '@/services/Comment/comment.service';
import Comments from '@/components/common/Comments/Comments';
import ImageIcon from '~svg/media/image.svg';
import AuthorTitle from '~common/AuthorTitle';
import TagsList from '~common/TagsList';
import ActionButtonsGroup from '~common/ActionButtonsGroup';
import Expandable from '~common/Expandable';
import { getRGB, adjustColor } from '@/utils/color';

export default {
  name: 'blog-post',
  props: {
    data: {
      type: Object,
      required: true
    },
    showComments: {
      type: Boolean,
      default: true
    },
    showActionButtons: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    masonry: {
      type: Boolean,
      default: true
    },
    usedInModal: {
      type: Boolean,
      default: false
    },
    expandable: {
      type: Boolean,
      default: false
    },
    commentThread: {
      type: Number
    }
  },
  components: {
    AuthorTitle,
    TagsList,
    ActionButtonsGroup,
    Comments,
    ImageIcon,
    Expandable
  },
  data() {
    return {
      newComment: '',
      dropdownOptions,
      isMounted: false,
      firstCommentId: null,
      backgroundColor: null,
      transitionTime: 300,
      makingContrast: null,
      spaceRemaining: 0,
      resizeCounter: 0,
      creatingComment: false,
      togglingLike: false
    };
  },
  methods: {
    ...mapActions([
      'updateBlogPostData',
      'deleteBlogPost',
      'setEditBlogPost',
      'setImagePreviewSrc',
      'setShareBlogPost',
      'openImageModal',
      'addToStat',
      'setModeratorDelete',
      'setAction',
      'addFlashMessage'
    ]),
    async refreshComments() {
      if (this.firstCommentId) {
        await this.$emit('refreshData');
      }
    },
    goToBlog() {
      const blog =
        this.isShared && !this.data.content
          ? this.lastInReblogChain.Alias.Blog
          : this.data.Alias.Blog;
      const { link, id } = blog;
      const params = {
        name: link || id,
        id: link ? undefined : 'id'
      };
      routerSecureNavigation({
        name: 'blog',
        params
      });
    },
    blogPostRoute({ toReblog, toBlogPost = toReblog } = {}) {
      const toThisBlogPost = !!(
        toReblog ||
        !this.isShared ||
        this.data.content.trim()
      );
      const { type, link, id } = toThisBlogPost
        ? this.data.origin
        : this.data.reblogOfBlogPost.origin;

      const name = `${type}${toBlogPost ? '-with-blog-post' : ''}`;
      const params = {
        name: link || id,
        id: link ? undefined : 'id',
        ...(toBlogPost && {
          postId: toThisBlogPost ? this.data.id : this.data.reblogOfBlogPostId
        })
      };

      return { name, params };
    },
    goToBlogPost(params) {
      const routeObject = this.blogPostRoute(params);
      routerSecureNavigation(routeObject);
    },
    onDeleteBlogPostBtnClicked() {
      this.confirmHandler(this.deleteBlogPostHandler, 'post');
    },
    async deleteBlogPostHandler() {
      if (this.data.userHasEditPermissions) {
        await this.deleteBlogPost({
          id: this.data.id,
          payload: { alias: this.activeAliasId }
        });
        await this.updateBlogPostData(this.data.id);
      } else {
        this.setModeratorDelete({ id: this.data.id, type: 'blog-post' });
      }
    },
    editBlogPostHandler() {
      this.setEditBlogPost({ data: this.data });
    },
    handleReportPost() {
      if (this.usedInModal) {
        this.$emit('reportPost', this.data);
      } else {
        this.$emit('reportPost', this.data);
      }
    },
    handleReportComment(comment) {
      if (this.usedInModal) {
        this.$emit('reportComment', comment);
      } else {
        // No-op, no comments are displayed outside modal context at the moment
      }
    },
    shareBlogPostHandler() {
      if (this.isAuthenticated) {
        this.setShareBlogPost({ data: this.data });
      }
    },
    async refresh() {
      this.newComment = '';
    },
    confirmHandler(callback, contentType, id) {
      this.$confirm({
        message: `Are you sure you want to delete this ${contentType}?`,
        button: {
          no: 'No',
          yes: 'Yes'
        },
        callback: confirm => {
          if (confirm) {
            callback(id);
          }
        }
      });
    },
    onDeleteCommentBtnClicked(id) {
      this.confirmHandler(this.handleDeleteComment, 'comment', id);
    },
    async handleDeleteComment(id) {
      const { Comments } = this.data;
      let parentCommentId;

      await commentDelete(id, { alias: this.activeAliasId });

      if (Comments.length === 1 && Comments[0].parentCommentId) {
        parentCommentId = Comments[0].parentCommentId;
      }
      removeCommentById(id, Comments);
      if (!Comments.length) {
        if (parentCommentId) {
          const data = await getComment(parentCommentId);
          this.shownComments = [data];

          if (!data.parentCommentId) {
            // we'll track that field in Comment.vue in order to show "View all comments" button
            data.lastCommentThread = true;
          }
        } else {
          this.refreshComments();
        }
      }

      this.refresh();
      this.addFlashMessage({ message: 'Comment deleted' });
    },
    /*@TODO make it dynamic and revise do we need comment id*/
    async handleCreateComment(parentComment) {
      if (this.creatingComment || !this.newComment || this.spaceRemaining < 0)
        return;
      this.creatingComment = true;

      const payload = {
        alias: this.activeAliasId,
        content: this.newComment
      };
      if (parentComment) {
        payload.parentComment = parentComment;
      } else {
        payload.blogPost = this.data.id;
      }

      try {
        const data = await createComment(payload);
        this.shownComments.push(data);
        this.refresh();
        this.addFlashMessage({ message: 'Comment created' });
      } catch (e) {
        return false;
      } finally {
        this.creatingComment = false;
      }
    },
    handleContentClick(e) {
      // const anchor = e.target.closest('a');
      // if (anchor) {
      //   return;
      // }

      e.preventDefault();
      e.stopPropagation();

      const { tagName } = e.target;
      const src = e.target.getAttribute('src');

      if (tagName === 'IMG' && src) {
        return this.openImageModal({ images: this.images, src });
      }

      // this.openBlogPostModal();
    },
    openFirstImage() {
      this.openImageModal({ images: this.images, src: this.images[0] });
    },
    openBlogPostModal() {
      if (this.usedInModal) return;

      return this.$router.push({
        name: `${this.$route.name}-with-blog-post`,
        params: {
          ...this.$route.params,
          postId: this.data.id
        }
      });
    },
    async postLikeToggle() {
      if (
        !this.togglingLike &&
        this.isAuthenticated &&
        (this.data.hasReactPermissions || this.data.userLiked)
      ) {
        this.togglingLike = true;
        const { id, userLiked } = this.data;
        const body = [id, { alias: this.activeAliasId }];

        userLiked ? await postUnlike(...body) : await postLike(...body);
        userLiked
          ? this.shownEngagementStats.likes--
          : this.shownEngagementStats.likes++;
        this.addToStat({ stat: 'likesCount', change: userLiked ? -1 : 1 });
        this.data.userLiked = !userLiked;
        this.togglingLike = false;
      }
    },
    ensureContrast() {
      this.backgroundColor = getRGB(this.$refs.blogPost);
      for (const childElement of this.$refs.blogPostText.getElementsByTagName(
        '*'
      )) {
        adjustColor(childElement, this.backgroundColor);
      }
    },
    addRel() {
      userContent.addRel(this.$refs.blogPost);
    }
  },
  computed: {
    ...mapState({
      isAuthenticated: state => state.auth.isAuthenticated,
      isModerator: state =>
        state.auth.userData && state.auth.userData.moderator,
      activeAliasId: state => state.alias.activeAliasId,
      themeDark: state => state.theme.themeDark
    }),
    ...mapGetters(['activeAliasBlog']),
    isShared() {
      return !!(
        this.data &&
        this.data.reblogOfBlogPost &&
        this.lastInReblogChain
      );
    },
    hasCommunity() {
      return this.data && this.data.Community && !this.data.Blog
        ? this.data.Community
        : null;
    },
    styleObject() {
      if (
        (!this.resizeCounter && !this.isMounted) ||
        !this.masonry ||
        this.usedInModal
      )
        return;
      /** @TODO take those from the variable @see https://temperance-software.atlassian.net/browse/FAN-219 */
      const rowHeight = 20; // It's from NewsFeed.vue .feed-news grid-auto-rows
      const rowGap = 15; // It's from NewsFeed.vue .feed-news grid-gap
      const rowSpan = Math.ceil(
        (this.$refs.wrapper.clientHeight + rowGap) / (rowHeight + rowGap)
      );
      return {
        gridRowEnd: `span ${rowSpan}`
      };
    },
    tagListListeners() {
      return this.$listeners && this.$listeners['select-tag']
        ? { select: event => this.$emit('select-tag', event) }
        : null;
    },
    authorTitleData() {
      return this.isShared && !this.data.content && this.lastInReblogChain
        ? this.lastInReblogChain
        : this.data;
    },
    images() {
      return (
        this.isMounted &&
        Array.prototype.map
          .call(this.$refs.blogPostText.getElementsByTagName('img'), img =>
            img.getAttribute('src')
          )
          .filter(value => value)
      );
    },
    imageNumber() {
      return [...new Set(this.images)].length;
    },
    sortedReblogs() {
      return (
        this.data.reblogChain &&
        this.data.reblogChain.length &&
        this.data.reblogChain
          .slice()
          .sort(({ id: firstId }, { id: secondId }) => firstId - secondId)
      );
    },
    sortedReblogsDisplay() {
      return (
        this.sortedReblogs &&
        (this.data.content.trim().length
          ? this.sortedReblogs
          : this.sortedReblogs.slice(0, -1))
      );
    },
    lastInReblogChain() {
      return (
        this.sortedReblogs && this.sortedReblogs[this.sortedReblogs.length - 1]
      );
    },
    reblogRoot() {
      return this.sortedReblogs && this.sortedReblogs[0];
    },
    reblogEngagementStats() {
      return this.reblogRoot && this.reblogRoot.engagementStats;
    },
    shownEngagementStats() {
      return this.reblogEngagementStats || this.data.engagementStats;
    },
    shownComments: {
      get() {
        return (
          (this.reblogRoot && this.reblogRoot.Comments) || this.data.Comments
        );
      },
      set(comments) {
        const blogPostOfComment = this.reblogRoot || this.data;
        blogPostOfComment.Comments = comments;
      }
    },
    blogParams() {
      const blog =
        this.isShared && !this.data.content
          ? this.lastInReblogChain.Alias.Blog
          : this.data.Alias.Blog;
      const { link, id } = blog;
      return {
        name: link || id,
        id: link ? undefined : 'id'
      };
    },
    blogPostParams() {
      return {
        ...this.$route.params,
        postId: this.data.id
      };
    }
  },
  watch: {
    themeDark() {
      clearTimeout(this.makingContrast);
      this.makingContrast = setTimeout(() => {
        this.ensureContrast();
      }, this.transitionTime + 200);
    },
    resizeCounter() {
      this.$emit('resized');
    }
  },
  mounted() {
    this.isMounted = true;
    if (this.shownComments && this.shownComments[0]) {
      this.firstCommentId = this.shownComments[0]?.id;
    }
    this.ensureContrast();
    this.addRel();
  }
};
</script>
<style lang="scss" scoped>
@import '@/assets/scss/common/_mixins';

.feed-news .blog-post {
  &:hover {
    box-shadow: var(--box-shadow);
    /** @TODO revise styles */
    // cursor: pointer;
  }
}
.blog-post {
  min-width: 0;
  background-color: var(--BG-blog-post);
  border-radius: var(--border-radius);
  transition: var(--transition-default);
  &__reposted {
    border-bottom: var(--border-width-default) solid
      var(--BG-button-secondary-disabled);
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    &:hover {
      box-shadow: none;
    }
  }
  &__header {
    margin: 0 var(--element-margin-l);
    overflow: auto;
    padding-top: var(--element-padding-l);

    &-pictures-count {
      float: right;
      cursor: pointer;
      color: var(--text-primary);
      stroke: var(--text-primary);
      &:hover {
        color: var(--text-secondary);
        stroke: var(--text-secondary);
      }
      &-icon {
        fill: var(--text-primary);
        margin-right: var(--element-margin-xs);
        vertical-align: middle;
      }
      &-number {
        vertical-align: middle;
      }
    }

    &-title {
      cursor: pointer;
    }
  }
  &__body {
    ::v-deep a {
      text-decoration: none;
    }

    &-tags {
      margin: 0 var(--element-margin-l);
    }

    &-image {
      width: 100%;
      height: auto;
      object-fit: cover;
    }
    &-content {
      color: var(--text-primary);
      font-size: var(--size-regular);
      margin: 0;
      padding: 0 var(--element-padding-m) var(--element-padding-m);
      word-wrap: break-word;
      overflow: auto;
      &.has-action {
        cursor: pointer;
      }

      ::v-deep a {
        text-decoration: underline;
      }

      /** @TODO revise styles */
      ::v-deep {
        @include user-content;
      }
    }
  }
}
</style>
