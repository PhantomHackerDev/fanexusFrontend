export default {
  data() {
    return {
      activeTab: 0,
      navTabs: []
    };
  },
  methods: {
    handleSetActiveTab(index) {
      this.activeTab = index;
    }
  }
};
