<template>
  <div class="followers-requests">
    <request
      :showButtons="true"
      :name="request.title"
      :activityName="request.text"
      :activityText="request.title"
      :date="request.date"
      v-for="(request, index) in requests"
      :key="`${request.title}-${index}`"
    />
  </div>
</template>

<script>
import { followersAreas } from '@/services/followers.service';
import Request from '@/components/Blog/Request';

export default {
  name: followersAreas.FollowersRequests,
  components: {
    Request
  },
  data() {
    return {
      data: null,
      requests: [
        {
          title: 'blog name',
          text: 'Follows from',
          date: '01-24-2019, 07:21'
        },
        {
          title: 'blog name2',
          text: 'Follows from',
          date: 'December 10, 2019'
        },
        {
          title: 'blog name3',
          text: 'Follows from',
          date: 'December 10, 2019'
        },
        {
          title: 'blog name4',
          text: 'Follows from',
          date: 'December 10, 2019'
        },
        {
          title: 'blog name5',
          text: 'Follows from',
          date: 'December 31, 2019'
        },
        {
          title: 'blog name6',
          text: 'Follows from',
          date: 'December 10, 2019'
        },
        {
          title: 'blog name',
          text: 'Follows from',
          date: '01-24-2019, 07:21'
        },
        {
          title: 'blog name2',
          text: 'Follows from',
          date: 'December 10, 2019'
        },
        {
          title: 'blog name3',
          text: 'Follows from',
          date: 'December 10, 2019'
        },
        {
          title: 'blog name4',
          text: 'Follows from',
          date: 'December 10, 2019'
        },
        {
          title: 'blog name5',
          text: 'Follows from',
          date: 'December 31, 2019'
        },
        {
          title: 'blog name6',
          text: 'Follows from',
          date: 'December 10, 2019'
        }
      ]
    };
  }
};
</script>
<style lang="scss" scoped>
.followers-requests {
  padding: var(--element-padding-xl);
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: var(--element-margin-m);
}
</style>
