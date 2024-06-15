<template>
  <div class="invites">
    <has-none :has-content="invites.length">
      <ul class="invites-list">
        <li
          class="invites-list__item"
          v-for="({ id, inviter, Community }, index) of invites"
          :key="`${id}-${index}`"
        >
          <div class="invites-list__item-message">
            <avatar
              v-if="Community.avatar"
              class="invites-list__item-avatar"
              size="md"
              :file="Community.avatar.src"
            /><router-link
              :to="{
                name: 'blog',
                params: { name: inviter.Blog.link || inviter.Blog.id }
              }"
              >{{ inviter.name }}</router-link
            >
            invited you to
            <router-link
              :to="{ name: 'community', params: { name: Community.link } }"
              >{{ Community.name }}</router-link
            >.
          </div>
          <div class="invites-list__item-actions">
            <form-button
              class="invites-list__item-accept-btn"
              type="submit"
              text="Accept"
              @click.native.stop="acceptInvite(Community.id)"
            />
            <form-button
              class="invites-list__item-reject-btn"
              type="submit"
              text="Reject"
              @click.native.stop="rejectInvite(Community.id)"
            />
          </div>
        </li>
      </ul>
    </has-none>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { getInvites } from '@/services/alias.service';
import {
  acceptInvite,
  rejectInvite
} from '@/services/Community/community.service';
import Avatar from '~common/Avatar';
import FormButton from '~common/Buttons/FormButton';
import HasNone from '~common/HasNone';

export default {
  components: {
    Avatar,
    FormButton,
    HasNone
  },
  data() {
    return {
      invites: []
    };
  },
  computed: {
    ...mapState({
      activeAliasId: state => state.alias.activeAliasId
    })
  },
  methods: {
    async getData() {
      this.invites = await getInvites();
    },
    async acceptInvite(communityId) {
      await acceptInvite(communityId);
      return this.getData();
    },
    async rejectInvite(communityId) {
      await rejectInvite(communityId);
      return this.getData();
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
.invites {
  padding: var(--element-padding-xl);
  overflow-y: auto;
  grid-area: content;

  &-list {
    list-style: none;
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    grid-gap: var(--element-margin-m);

    &__item {
      display: block;
      border-radius: var(--border-radius);
      background-color: var(--BG-blog-post);
      transition: var(--transition-default);
      padding: var(--element-padding-m) var(--element-padding-l);
      color: var(--text-primary);
      overflow: auto;

      &-avatar {
        float: left;
        margin-bottom: var(--element-margin-s);
        margin-right: var(--element-margin-s);
      }

      &-actions {
        margin-top: var(--element-margin-s);
        clear: left;
      }

      &-reject-btn {
        margin-left: var(--element-margin-m);
      }

      ::v-deep a {
        text-decoration: none;
        color: var(--text-secondary);
      }
    }
  }
}
</style>
