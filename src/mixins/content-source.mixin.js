import { mapState, mapGetters } from 'vuex';

export default {
  computed: {
    ...mapState({
      activeAliasId: state => state.alias.activeAliasId,
      isAuthenticated: state => state.auth.isAuthenticated,
      data: state => state.feed.data
    }),
    ...mapGetters(['activeAlias']),
    additionalOptions() {
      return this.isAuthenticated
        ? [
            {
              text: this.data.aliasBlocking ? 'Unblock' : 'Block',
              action: this.data.aliasBlocking ? 'unblock' : 'block',
              special: true,
              toggleable: false
            }
          ]
        : undefined;
    }
  }
};
