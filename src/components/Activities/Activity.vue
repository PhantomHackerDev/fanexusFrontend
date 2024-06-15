<template>
  <article
    class="activity-list-item"
    :class="{ 'activity-list-item__unseen': !data.isSeen }"
  >
    <div class="activity-list-item__date">
      {{ data.createdAt | dateFormat }}
    </div>
    <div :class="`activity-list-item__${data.type}`">
      <router-link
        :to="{
          name: 'blog',
          params: {
            name: data.sourceAlias.Blog.link || data.sourceAlias.Blog.id
          }
        }"
        >{{ data.sourceAlias.name }}</router-link
      >
      <component :is="`activity-${activityTypes[data.type]}`" :data="data" />
    </div>
  </article>
</template>

<script>
import { activityTypes } from '@/services/activities.service';
import ActivityJoin from '@/components/Activities/ActivityJoin.vue';
import ActivityComment from '@/components/Activities/ActivityComment.vue';
import ActivityFollow from '@/components/Activities/ActivityFollow.vue';
import ActivityInvite from '@/components/Activities/ActivityInvite.vue';
import ActivityLike from '@/components/Activities/ActivityLike.vue';
import ActivityReblog from '@/components/Activities/ActivityReblog.vue';
import ActivityAcceptMember from '@/components/Activities/ActivityAcceptMember.vue';

export default {
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  components: {
    ActivityJoin,
    ActivityComment,
    ActivityFollow,
    ActivityInvite,
    ActivityLike,
    ActivityReblog,
    ActivityAcceptMember
  },
  data() {
    return {
      activityTypes
    };
  },
  computed: {
    sourceAliasName() {
      return this.data.sourceAlias.name;
    }
  }
};
</script>

<style lang="scss" scoped>
.activity-list-item {
  color: var(--text-primary);
  background-color: var(--BG-blog-post);
  padding: var(--element-padding-m);
  overflow-wrap: break-word;
  overflow: auto;
  max-width: var(--width-large);
  margin: 0 auto;

  ::v-deep a {
    text-decoration: none;
    color: var(--text-secondary);
  }

  &__unseen {
    background-color: var(--BG-repost);
  }

  &:hover {
    background-color: var(--activity-hover);
  }
}
</style>
