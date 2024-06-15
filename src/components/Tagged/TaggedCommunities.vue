<template>
  <await-response :has-response="loaded">
    <div class="main-area">
      <div class="loading-error" v-if="error">
        {{ error.message }}
      </div>
      <div class="tagged-communities" v-else>
        <my-community-card
          :src="(group.coverImage && group.coverImage.src) || undefined"
          :membersCount="group.membersCount"
          :communityName="group.name"
          v-for="(group, index) in groups"
          :key="`${group.id}-${index}`"
          :data="group"
        />
      </div>
    </div>
  </await-response>
</template>

<script>
import { getTaggedCommunities } from '@/services/tag.service';
import MyCommunityCard from '@/components/Activities/MyCommunityCard';
import AwaitResponse from '~common/AwaitResponse';

export default {
  props: {
    tagNames: {
      required: true,
      type: String
    }
  },
  components: {
    MyCommunityCard,
    AwaitResponse
  },
  data() {
    return {
      groups: [],
      error: null,
      loaded: false
    };
  },
  methods: {
    async getData() {
      try {
        this.groups = await getTaggedCommunities(this.tagNames);
      } catch (e) {
        this.error = e;
      }
    }
  },
  async mounted() {
    await this.getData();
    this.loaded = true;
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/common/_mixins';
.tagged-communities {
  padding: var(--element-padding-xl);
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr);
  grid-gap: var(--element-margin-m);
  @include mobile {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    padding-bottom: 50px;
  }
}

.loading-error {
  color: var(--error);
  text-align: center;
  margin-top: var(--element-margin-m);
}
</style>
