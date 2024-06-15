export default {
  data() {
    return {
      ro: null,
      resizeCounter: 0,
      windowHeight: null
    };
  },
  methods: {
    // @see https://caniuse.com/#search=resizeobserver
    resizeObserver(ref) {
      if (!ref) return;
      this.ro = new ResizeObserver(() => this.resizeCounter++).observe(ref);
    },
    onResize() {
      this.windowHeight = window.innerHeight;
    }
  }
};
