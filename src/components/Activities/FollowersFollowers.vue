<template>
  <div v-if="data.followedBy" class="followers-followers">
    <group-component
      :group-component-type="followableTypes.blog"
      :name="follower.Blog && follower.Blog.name"
      :id="follower.Blog && follower.Blog.id"
      :link="follower.Blog && follower.Blog.link"
      activityName="Followed on"
      :bottomText="follower.Blog && follower.Blog.description"
      :date="follower.Follow && follower.Follow.createdAt"
      :image="(follower.Blog.avatar && follower.Blog.avatar.src) || undefined"
      v-for="(follower, index) in data.followedBy"
      :key="`${follower.name}-${index}`"
    />
  </div>
</template>

<script>
import { followersAreas } from '@/services/followers.service';
import { followableTypes } from '@/services/following.service';
import GroupComponent from '@/components/Blog/GroupComponent';

export default {
  name: followersAreas.FollowersFollowers,
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      followableTypes
    };
  },
  components: {
    GroupComponent
  }
};
</script>
<style lang="scss" scoped>
@import '@/assets/scss/common/_mixins';
.followers-followers {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  grid-gap: var(--element-margin-m);
  @include tablet {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
