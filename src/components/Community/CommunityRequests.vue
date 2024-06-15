<template>
  <await-response :has-response="loaded"
    ><has-none :has-content="requestsData.length"
      ><div class="followers-requests">
        <request
          v-for="{ Alias, id, createdAt } in requestsData"
          :showButtons="true"
          :alias="Alias"
          activityName="followed your community:"
          :activityText="'@' + data.link"
          :date="createdAt"
          :key="id"
          @decline="() => handleUserRequest(id)"
          @accept="() => handleUserRequest(id, true)"
        /></div></has-none
  ></await-response>
</template>

<script>
import { mapState } from 'vuex';
import {
  communityAreas,
  getCommunityRequests,
  declineRequest,
  acceptRequest
} from '@/services/Community/community.service';
import Request from '@/components/Blog/Request';
import HasNone from '~common/HasNone';
import AwaitResponse from '~common/AwaitResponse';

export default {
  name: communityAreas.requests,
  components: {
    Request,
    HasNone,
    AwaitResponse
  },
  props: {
    communityId: {
      required: true,
      type: Number
    },
    data: {
      type: Object
    }
  },
  data() {
    return {
      requestsData: [],
      currentPage: 1,
      communityRequestData: {
        alias: null,
        requestId: null
      },
      loaded: false
    };
  },
  methods: {
    async getData() {
      const payload = {
        alias: this.activeAliasId
      };
      try {
        this.requestsData = await getCommunityRequests(
          this.communityId,
          this.currentPage,
          payload
        );
      } catch (e) {
        return false;
      }
    },
    async handleUserRequest(memberId, isAccept) {
      this.communityRequestData.requestId = memberId;
      this.communityRequestData.alias = this.activeAliasId;
      const payload = [this.communityId, this.communityRequestData];
      if (isAccept) {
        try {
          await acceptRequest(...payload);
          await this.getData();
        } catch (e) {
          return false;
        } finally {
          this.communityRequestData.requestId = null;
          this.communityRequestData.alias = null;
        }
      } else {
        try {
          await declineRequest(...payload);
          await this.getData();
        } catch (e) {
          return false;
        } finally {
          this.communityRequestData.requestId = null;
          this.communityRequestData.alias = null;
        }
      }
    }
  },
  computed: {
    ...mapState({
      activeAliasId: state => state.alias.activeAliasId
    })
  },
  async mounted() {
    await this.getData();
    this.loaded = true;
  }
};
</script>
<style lang="scss" scoped>
.followers-requests {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  grid-gap: var(--element-margin-m);
}
</style>
