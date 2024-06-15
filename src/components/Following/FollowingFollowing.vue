<template>
  <div class="following-following">
    <!--  @TODO add routing -->
    <has-none
      :has-content="
        data.followTag.length ||
          data.followBlog.length ||
          data.followCommunity.length
      "
    >
      <following-tags
        heading="Tags"
        v-if="data.followTag.length"
        :followingTags="data.followTag"
        @remove-tag="$emit('remove-tag', $event)"
        ><show-all-button @click="redirectToAllTags" text="Show all"
      /></following-tags>
      <template v-if="data.followBlog.length">
        <h3 class="following-following__heading">Blogs</h3>
        <div class="following-following__blog-wrappers">
          <group-component
            :group-component-type="followableTypes.blog"
            :id="blog.id"
            :name="blog.name"
            :link="blog.link"
            :activity-name="activityName"
            :date="blog.Follow && blog.Follow.createdAt"
            :bottomText="blog.description"
            :image="(blog.avatar && blog.avatar.src) || undefined"
            v-for="(blog, index) in data.followBlog"
            :key="`${blog.name}-${index}`"
            :button-type="buttonType"
          />
        </div>
      </template>
      <template v-if="data.followCommunity.length">
        <h3 class="following-following__heading">Communities</h3>
        <div class="following-following__blog-wrappers">
          <group-component
            :group-component-type="followableTypes.community"
            :id="community.id"
            :link="community.link"
            :name="community.name"
            :activity-name="activityName"
            :date="community.Follow && community.Follow.createdAt"
            :bottomText="community.description"
            :image="(community.avatar && community.avatar.src) || undefined"
            v-for="(community, index) in data.followCommunity"
            :key="`${community.id}-${index}`"
            :button-type="buttonType"
          />
        </div>
      </template>
    </has-none>
  </div>
</template>

<script>
import { followingAreas, followableTypes } from '@/services/following.service';
import FollowingTags from '@/components/Following/FollowingTags';
import GroupComponent from '@/components/Blog/GroupComponent';
import ShowAllButton from '~common/Buttons/ShowAllButton';
import HasNone from '~common/HasNone';
import { mapState } from 'vuex';

export default {
  name: followingAreas.FollowingFollowing,
  components: {
    FollowingTags,
    GroupComponent,
    ShowAllButton,
    HasNone
  },
  props: {
    data: {
      required: true
    },
    buttonType: {
      type: String,
      required: true
    },
    activityName: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      followableTypes
    };
  },
  computed: {
    ...mapState({
      activeAliasId: state => state.alias.activeAliasId
    })
  },
  methods: {
    /** @TODO add routing*/
    redirectToAllTags() {}
  }
};
</script>
<style lang="scss" scoped>
@import '@/assets/scss/common/_mixins';
.following-following {
  margin: var(--element-margin-xl) 35px var(--element-margin-xxl)
    var(--element-margin-xl);
  &__heading {
    font-family: 'OpenSans-Bold', sans-serif;
    font-size: var(--size-title);
    color: var(--text-primary);
    &:not(:first-child) {
      margin-top: var(--element-margin-l);
    }
  }
  &__blog-wrappers {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    grid-gap: var(--element-margin-m);
    @include tablet {
      grid-template-columns: minmax(0, 1fr);
    }
  }
}
</style>
