<template>
  <div class="moderation-log">
    <table class="moderation-log__table">
      <thead class="moderation-log__table-head">
        <tr>
          <th class="moderation-log__item">Moderator</th>
          <th class="moderation-log__item">Action</th>
          <th class="moderation-log__item">Reason</th>
          <th class="moderation-log__item">Content</th>
          <th class="moderation-log__item">Time</th>
        </tr>
      </thead>
      <tbody>
        <moderation-log-item
          v-for="({ id, Alias, reason, details, createdAt },
          index) of moderatorActivities"
          :key="`${id}-${index}`"
          class="moderation-log__table-row"
          :alias="Alias"
          :reason="reason"
          :details="details"
          :created-at="createdAt"
        />
      </tbody>
    </table>
  </div>
</template>

<script>
import { getModerationActions } from '@/services/moderation.service';
import ModerationLogItem from '@/components/Moderation/ModerationLogItem';

export default {
  components: {
    ModerationLogItem
  },
  data() {
    return {
      moderatorActivities: []
    };
  },
  methods: {
    async getData() {
      this.moderatorActivities = await getModerationActions();
    }
  },
  async mounted() {
    await this.getData();
  }
};
</script>

<style lang="scss" scoped>
.moderation-log {
  border: var(--border-width-default) solid var(--border-block);
  border-radius: var(--border-radius);
  background-color: var(--BG-blog-post);
  padding: var(--element-padding-s);
  margin-top: var(--element-margin-m);

  &__table {
    width: 100%;
    color: var(--text-primary);

    &-head {
      font-weight: bold;
    }
    &-row:nth-child(even) {
      background-color: var(--BG-repost);
    }
  }
}
</style>
