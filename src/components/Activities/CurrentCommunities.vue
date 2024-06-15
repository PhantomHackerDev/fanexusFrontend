<template>
  <div class="current-communities">
    <router-link
      :to="{ name: 'create-community' }"
      class="current-communities__link"
      ><add-button
        text="Create new community"
        class="current-communities__add-btn"
    /></router-link>
    <my-community-card
      :src="(group.coverImage && group.coverImage.src) || undefined"
      :membersCount="group.membersCount"
      :communityName="group.name"
      v-for="(group, index) in groups"
      :key="`${group.title}-${index}`"
      :data="group"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import MyCommunityCard from '@/components/Activities/MyCommunityCard';
import AddButton from '~common/Buttons/AddButton';
import { myCommunities } from '@/services/Community/community.service';

export default {
  components: {
    MyCommunityCard,
    AddButton
  },
  data() {
    return {
      groups: null
    };
  },
  computed: {
    ...mapState({
      activeAliasId: state => state.alias.activeAliasId
    })
  },
  methods: {
    async getData() {
      this.groups = await myCommunities();
    }
  },
  watch: {
    activeAliasId: {
      handler(val) {
        if (val) {
          return this.getData();
        }
      },
      immediate: true
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/common/_mixins';
.current-communities {
  padding: var(--element-padding-xl);
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  grid-gap: var(--element-margin-m);
  @include mobile {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  &__link {
    text-decoration: none;
    height: 150px;
  }
  &__add-btn {
    width: 100%;
    height: 100%;
    @include mobile {
      padding: var(--element-padding-s);
    }
  }
}
</style>
