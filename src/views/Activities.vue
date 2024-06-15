<template>
  <section class="activities" v-if="activities">
    <await-response :has-response="loaded">
      <has-none :has-content="activities.length">
        <activity
          class="activities-item"
          v-for="(activity, index) in activities"
          :key="`${activity.id}-${index}`"
          :data="activity"
        />
      </has-none>
    </await-response>
  </section>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import Activity from '@/components/Activities/Activity.vue';
import HasNone from '~common/HasNone';
import AwaitResponse from '~common/AwaitResponse';

export default {
  components: {
    Activity,
    HasNone,
    AwaitResponse
  },
  data() {
    return {
      loaded: false
    };
  },
  computed: {
    ...mapState({
      activities: state => state.activities.list,
      activeAliasId: state => state.alias.activeAliasId
    })
  },
  methods: {
    ...mapActions(['getActivitiesData', 'resetActivitiesCount']),
    getData() {
      return this.getActivitiesData({
        alias: this.activeAliasId
      });
    }
  },
  watch: {
    activeAliasId: {
      async handler(val) {
        if (val) {
          await this.getData();
          this.loaded = true;
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.resetActivitiesCount();
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/common/_mixins';
.activities {
  grid-area: content;
  overflow: auto;
  background-color: var(--BG-primary);
  padding: var(--element-padding-l);
  @include mobile {
    padding-bottom: 50px;
  }

  &-item:not(:first-child) {
    border-top: var(--border-width-default) solid var(--activity-divider);
  }
}
</style>
